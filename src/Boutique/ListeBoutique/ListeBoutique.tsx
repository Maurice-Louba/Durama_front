import { useEffect, useState, useMemo } from "react";
import { MdShoppingCart, MdSearch, MdFilterList, MdClose, MdStar, MdLocalShipping } from "react-icons/md";
import { IoCubeOutline } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import Swal from "sweetalert2";
import { getTokens } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

interface Produit {
  id: number;
  nom: string;
  categorie: {
    gros_categorie: string;
  };
  description: string;
  prix_vente: string;
  prix_promo: string;
  image_principale: string;
  etat_stock: string;
  slug:string;
  note_moyenne?: number;
  livraison_gratuite?: boolean;
}

interface FilterState {
  categories: string[];
  prixMin: string;
  prixMax: string;
  stock: string;
  livraisonGratuite: boolean;
}

const Boutique = () => {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    prixMin: "",
    prixMax: "",
    stock: "all",
    livraisonGratuite: false
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/produits-aleatoires/");
        // Ajouter des données simulées pour la démo
        const produitsAvecDetails = response.data.map((prod: any) => ({
          ...prod,
          note_moyenne: Math.random() * 2 + 3, // Note entre 3 et 5
          
        }));
        setProduits(produitsAvecDetails);
      } catch (err: any) {
        console.log(err.message);
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Impossible de charger les produits",
          confirmButtonColor: "#d33",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Extraire les catégories uniques
  const categories = useMemo(() => {
    const cats = produits.map(p => p.categorie.gros_categorie);
    return [...new Set(cats)].filter(Boolean);
  }, [produits]);

  // Filtrer les produits
  const filteredProduits = useMemo(() => {
    return produits.filter(prod => {
      const matchesSearch = prod.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prod.categorie.gros_categorie.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = filters.categories.length === 0 || 
                             filters.categories.includes(prod.categorie.gros_categorie);
      
      const prix = parseFloat(prod.prix_promo === "0.00" ? prod.prix_vente : prod.prix_promo);
      const matchesMinPrice = !filters.prixMin || prix >= parseFloat(filters.prixMin);
      const matchesMaxPrice = !filters.prixMax || prix <= parseFloat(filters.prixMax);
      
      const matchesStock = filters.stock === "all" || 
                          (filters.stock === "in_stock" && (prod.etat_stock === "en stock" || prod.etat_stock === "sur commande")) ||
                          (filters.stock === "out_of_stock" && prod.etat_stock !== "en stock" && prod.etat_stock !== "sur commande");
      
      const matchesLivraison = !filters.livraisonGratuite || prod.livraison_gratuite;
      
      return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesStock && matchesLivraison;
    });
  }, [produits, searchTerm, filters]);

  const formatNomProduit = (nom: string, maxLength: number = 20) => {
    if (!nom) return "";
    return nom.length > maxLength ? nom.slice(0, maxLength) + "…" : nom;
  };

  const handleAjoutPanier = async (prod: Produit) => {
    const { access } = getTokens();

    if (!access) {
      Swal.fire({
        title: "Connexion requise 🔒",
        text: "Vous devez d'abord vous connecter ou créer un compte avant d'ajouter un produit au panier.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#000000",
        cancelButtonColor: "#d33",
        confirmButtonText: "Se connecter / Créer un compte",
        cancelButtonText: "Annuler",
        background: "#f9fafb",
        color: "#333",
        customClass: {
          popup: "rounded-2xl shadow-xl",
          confirmButton: "rounded-md px-4 py-2 font-semibold",
          cancelButton: "rounded-md px-4 py-2 font-semibold",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/Profil");
        }
      });
      return;
    }

    try {
      const response = await axiosInstance.post("/panier/items/", {
        produit_id: prod.id,
        quantite: 1,
        is_variable: false,
        produit_variable: null,
        attribut_valeur: null
      });

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Ajouté au panier 🛒",
          text: `${prod.nom} a été ajouté avec succès !`,
          confirmButtonColor: "#000000",
          background: "#f9fafb",
          color: "#333",
          timer: 2000,
        });
      }
    } catch (error: any) {
      console.error("Erreur lors de l'ajout au panier :", error);
      Swal.fire({
        icon: "error",
        title: "Erreur",
        text: error.response?.data?.detail || "Impossible d'ajouter le produit au panier.",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleCategoryFilter = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      prixMin: "",
      prixMax: "",
      stock: "all",
      livraisonGratuite: false
    });
    setSearchTerm("");
  };



  const renderStars = (note: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <MdStar
            key={star}
            className={`text-xs ${
              star <= Math.floor(note)
                ? "text-yellow-400 fill-current"
                : "text-gray-300"
            }`}
          />
        ))}
        <span className="text-xs text-gray-500 ml-1">({note.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Header Sticky */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-200 py-4 px-4">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-xl font-bold text-gray-900 text-center">
            Boutique BTP
          </h1>
          
          {/* Barre de recherche */}
          <div className="relative mt-3">
            <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-sm"
            />
          </div>

          {/* Filtres rapides */}
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg text-sm font-medium"
            >
              <MdFilterList className="text-base" />
              <span>Filtres</span>
            </button>
            
            {!loading && (
              <span className="text-sm text-gray-600">
                {filteredProduits.length} produit{filteredProduits.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filtres dépliants */}
      {showFilters && (
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-4">
          <div className="max-w-[1400px] mx-auto space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Filtres</h3>
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 flex items-center gap-1"
              >
                <MdClose className="text-base" />
                Tout effacer
              </button>
            </div>

            {/* Catégories */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Catégories</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => handleCategoryFilter(category)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                      filters.categories.includes(category)
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Prix et options */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Prix min (GNF)
                </label>
                <input
                  type="number"
                  value={filters.prixMin}
                  onChange={(e) => setFilters(prev => ({ ...prev, prixMin: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Prix max (GNF)
                </label>
                <input
                  type="number"
                  value={filters.prixMax}
                  onChange={(e) => setFilters(prev => ({ ...prev, prixMax: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="50000"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Stock
                </label>
                <select
                  value={filters.stock}
                  onChange={(e) => setFilters(prev => ({ ...prev, stock: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">Tous</option>
                  <option value="in_stock">Disponible</option>
                  <option value="out_of_stock">Rupture</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-xs text-gray-700">
                  <input
                    type="checkbox"
                    checked={filters.livraisonGratuite}
                    onChange={(e) => setFilters(prev => ({ ...prev, livraisonGratuite: e.target.checked }))}
                    className="rounded border-gray-300 text-black focus:ring-black"
                  />
                  Livraison gratuite
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="max-w-[1400px] mx-auto px-4 py-4">
        {/* Indicateur de chargement */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        )}

        {/* Message aucun résultat */}
        {!loading && filteredProduits.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-600 mb-4">Essayez de modifier vos critères de recherche</p>
            <button
              onClick={clearFilters}
              className="px-6 py-2 bg-black text-white rounded-lg text-sm font-medium"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* Grille des produits - VERSION MOBILE AMÉLIORÉE */}
        <div className="grid grid-cols-2 gap-3">
          {filteredProduits.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200 group"
            >
              {/* Image avec badges */}
              <div className="relative">
                <img
                  src={`https://durama-project.onrender.com${prod.image_principale}`}
                  alt={prod.nom}
                  className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                
                {/* Badge promotion */}
                {prod.prix_promo !== "0.00" && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                    PROMO
                  </div>
                )}
                
                {/* Badge livraison gratuite */}
                {prod.livraison_gratuite && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                    <MdLocalShipping className="text-xs" />
                    Gratuite
                  </div>
                )}
              </div>

              {/* Contenu de la carte */}
              <div className="p-3 space-y-2">
                {/* Catégorie */}
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  {prod.categorie.gros_categorie}
                </p>

                {/* Nom du produit */}
                <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
                  {formatNomProduit(prod.nom, 18)}
                </h3>

                {/* Notes */}
                {prod.note_moyenne && renderStars(prod.note_moyenne)}

                {/* Prix */}
                <div className="space-y-1">
                  {prod.prix_promo === "0.00" ? (
                    <p className="text-lg font-bold text-gray-900">{prod.prix_vente} GNF</p>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-lg font-bold text-gray-900">{prod.prix_promo} GNF</p>
                      <p className="text-sm text-red-500 line-through">{prod.prix_vente} GNF</p>
                    </div>
                  )}
                </div>

                {/* Stock */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <IoCubeOutline 
                      className={`${
                        prod.etat_stock === "en stock" ? "text-green-500" :
                        prod.etat_stock === "sur commande" ? "text-blue-500" :
                        "text-red-500"
                      }`} 
                      size={14} 
                    />
                    <span className={`text-xs font-medium ${
                      prod.etat_stock === "en stock" ? "text-green-600" :
                      prod.etat_stock === "sur commande" ? "text-blue-600" :
                      "text-red-600"
                    }`}>
                      {prod.etat_stock}
                    </span>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-2 pt-1">
                  <button 
                    disabled={prod.etat_stock !== "en stock" && prod.etat_stock !== "sur commande"} 
                    onClick={() => handleAjoutPanier(prod)} 
                    className={`flex-1 py-2.5 rounded-lg text-white text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                      prod.etat_stock === "en stock" || prod.etat_stock === "sur commande"
                        ? "bg-black hover:bg-gray-800 active:scale-95"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <MdShoppingCart className="text-base" />
                    <span className="text-xs">Ajouter</span>
                  </button>
                  
                  <button onClick={()=>navigate(`/produit/${prod.slug}`)} className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                    <span className="text-lg"><FaRegEye  size={15} className="text-black"/></span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Boutique;