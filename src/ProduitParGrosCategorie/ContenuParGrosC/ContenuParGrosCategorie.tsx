import { useEffect, useState, useMemo } from "react";
import { MdShoppingCart, MdSearch, MdFilterList, MdClose, MdStar, MdLocalShipping } from "react-icons/md";
import { IoCubeOutline } from "react-icons/io5";
import { FaRegEye } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

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
  slug: string;
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

const ProduitParCategorie= () => {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const {gros_categorie}=useParams()
  const {isAuthenticated}=useAuth()
  
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
        const response = await axiosInstance.get(`/produit-par-gros-categorie/${gros_categorie}/`);
        const produitsAvecDetails = response.data.map((prod: any) => ({
          ...prod,
          note_moyenne: Math.random() * 2 + 3,
          livraison_gratuite: Math.random() > 0.7
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
    

    if (!isAuthenticated) {
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
    <div className="bg-gray-50 min-h-screen">
      {/* Header Sticky */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 py-4 lg:py-6 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="text-center lg:text-left">
              <h1 className="text-xl lg:text-3xl font-bold text-gray-900">
                {gros_categorie}
              </h1>
              <p className="text-gray-600 mt-1 hidden lg:block text-sm">
                Découvrez notre sélection de produits professionnels
              </p>
            </div>
            
            {/* Barre de recherche */}
            <div className="relative w-full lg:w-96">
              <MdSearch className="absolute left-3 lg:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg lg:text-xl" />
              <input
                type="text"
                placeholder="Rechercher un produit, une catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 lg:pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent text-sm transition-all duration-200"
              />
            </div>
          </div>

          {/* Filtres rapides */}
          <div className="flex items-center justify-between mt-4 lg:mt-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 lg:gap-3 px-4 lg:px-6 py-2 lg:py-3 bg-black text-white rounded-lg lg:rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors duration-200 shadow-md"
              >
                <MdFilterList className="text-base lg:text-lg" />
                <span>Filtres</span>
              </button>
              
              {/* Filtres actifs visuels - Desktop seulement */}
              <div className="hidden lg:flex items-center gap-2">
                {(filters.categories.length > 0 || filters.prixMin || filters.prixMax || filters.stock !== "all" || filters.livraisonGratuite) && (
                  <>
                    <span className="text-sm text-gray-600">Filtres actifs :</span>
                    {filters.categories.map(cat => (
                      <span key={cat} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                        {cat}
                      </span>
                    ))}
                    {filters.livraisonGratuite && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Livraison gratuite
                      </span>
                    )}
                  </>
                )}
              </div>
            </div>
            
            {!loading && (
              <span className="text-sm text-gray-600 bg-white px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg border border-gray-200">
                {filteredProduits.length} produit{filteredProduits.length > 1 ? 's' : ''} trouvé{filteredProduits.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Filtres dépliants */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 px-4 py-4 lg:py-6 shadow-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-4 lg:mb-6">
              <h3 className="font-semibold text-gray-900 text-base lg:text-lg">Filtres avancés</h3>
              <button
                onClick={clearFilters}
                className="text-gray-600 hover:text-gray-800 flex items-center gap-2 transition-colors duration-200 text-sm lg:text-base"
              >
                <MdClose className="text-lg" />
                <span className="font-medium">Tout effacer</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-6">
              {/* Catégories */}
              <div className="lg:col-span-2">
                <h4 className="text-sm font-semibold text-gray-700 mb-2 lg:mb-3 uppercase tracking-wide">Catégories</h4>
                <div className="flex flex-wrap gap-2 lg:gap-3">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => handleCategoryFilter(category)}
                      className={`px-3 lg:px-4 py-1.5 lg:py-2.5 rounded-lg border text-xs lg:text-sm font-medium transition-all duration-200 ${
                        filters.categories.includes(category)
                          ? 'bg-black text-white border-black shadow-md'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Prix */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 lg:mb-3 uppercase tracking-wide">Prix (GNF)</h4>
                <div className="space-y-2 lg:space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1 lg:mb-2">
                      Prix minimum
                    </label>
                    <input
                      type="number"
                      value={filters.prixMin}
                      onChange={(e) => setFilters(prev => ({ ...prev, prixMin: e.target.value }))}
                      className="w-full px-3 lg:px-4 py-2 lg:py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1 lg:mb-2">
                      Prix maximum
                    </label>
                    <input
                      type="number"
                      value={filters.prixMax}
                      onChange={(e) => setFilters(prev => ({ ...prev, prixMax: e.target.value }))}
                      className="w-full px-3 lg:px-4 py-2 lg:py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="50000"
                    />
                  </div>
                </div>
              </div>

              {/* Options */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-2 lg:mb-3 uppercase tracking-wide">Options</h4>
                <div className="space-y-3 lg:space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1 lg:mb-2">
                      Disponibilité
                    </label>
                    <select
                      value={filters.stock}
                      onChange={(e) => setFilters(prev => ({ ...prev, stock: e.target.value }))}
                      className="w-full px-3 lg:px-4 py-2 lg:py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="all">Tous les produits</option>
                      <option value="in_stock">En stock</option>
                      <option value="out_of_stock">Rupture de stock</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 lg:gap-3 p-2 lg:p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <input
                      type="checkbox"
                      checked={filters.livraisonGratuite}
                      onChange={(e) => setFilters(prev => ({ ...prev, livraisonGratuite: e.target.checked }))}
                      className="rounded border-gray-300 text-black focus:ring-black h-4 w-4"
                    />
                    <div>
                      <label className="text-xs lg:text-sm font-medium text-gray-700">
                        Livraison gratuite
                      </label>
                      <p className="text-xs text-gray-500 mt-0.5 hidden lg:block">Produits éligibles uniquement</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 py-4 lg:py-8">
        {/* Indicateur de chargement */}
        {loading && (
          <div className="flex justify-center items-center py-12 lg:py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 lg:h-12 w-8 lg:w-12 border-b-2 border-black mx-auto mb-3 lg:mb-4"></div>
              <p className="text-gray-600 text-sm lg:text-base">Chargement des produits...</p>
            </div>
          </div>
        )}

        {/* Message aucun résultat */}
        {!loading && filteredProduits.length === 0 && (
          <div className="text-center py-12 lg:py-16">
            <div className="text-6xl lg:text-8xl mb-4 lg:mb-6">🔍</div>
            <h3 className="text-lg lg:text-xl font-semibold text-gray-900 mb-2 lg:mb-3">Aucun produit trouvé</h3>
            <p className="text-gray-600 mb-4 lg:mb-6 text-sm lg:text-base">
              Essayez de modifier vos critères de recherche
            </p>
            <button
              onClick={clearFilters}
              className="px-6 lg:px-8 py-2 lg:py-3 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors duration-200 shadow-md"
            >
              Réinitialiser tous les filtres
            </button>
          </div>
        )}

        {/* Grille des produits - 2 COLONNES MOBILE, 3-4 COLONNES DESKTOP */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6">
          {filteredProduits.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-xl lg:rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg lg:hover:shadow-xl transition-all duration-300 group lg:hover:-translate-y-1"
            >
              {/* Image avec badges */}
              <div className="relative overflow-hidden">
                <img
                  src={`https://durama-project.onrender.com${prod.image_principale}`}
                  alt={prod.nom}
                  className="w-full h-40 lg:h-48 object-cover group-hover:scale-105 lg:group-hover:scale-110 transition-transform duration-300"
                />
                
                {/* Overlay au hover - Desktop seulement */}
                {/*<div className="absolute inset-0 bg-black bg-opacity-0 lg:group-hover:bg-opacity-10 transition-all duration-300" />*/}
                
                {/* Badge promotion */}
                {prod.prix_promo !== "0.00" && (
                  <div className="absolute top-2 lg:top-3 left-2 lg:left-3 bg-red-500 text-white px-2 lg:px-3 py-1 lg:py-1.5 rounded text-xs font-bold shadow-md">
                    PROMO
                  </div>
                )}
                
                {/* Badge livraison gratuite */}
                {prod.livraison_gratuite && (
                  <div className="absolute top-2 lg:top-3 right-2 lg:right-3 bg-green-500 text-white px-2 lg:px-3 py-1 lg:py-1.5 rounded text-xs font-medium flex items-center gap-1 shadow-md">
                    <MdLocalShipping className="text-xs" />
                    <span className="hidden lg:inline">Gratuite</span>
                  </div>
                )}

                {/* Bouton vue rapide - Desktop seulement */}
                <button 
                  onClick={() => navigate(`/produit/${prod.slug}`)}
                  className="absolute bottom-2 lg:bottom-3 right-2 lg:right-3 bg-white text-gray-700 p-1.5 lg:p-2 rounded-full opacity-0 lg:group-hover:opacity-100 transition-all duration-300 transform translate-y-2 lg:group-hover:translate-y-0 shadow-md hover:bg-gray-50 hover:scale-110"
                >
                  <FaRegEye size={14} className="lg:w-4 lg:h-4" />
                </button>
              </div>

              {/* Contenu de la carte */}
              <div className="p-3 lg:p-4 space-y-2 lg:space-y-3">
                {/* Catégorie */}
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  {prod.categorie.gros_categorie}
                </p>

                {/* Nom du produit */}
                <h3 className="font-bold text-gray-900 text-sm lg:text-base leading-tight line-clamp-2 min-h-[2.5rem] group-hover:text-gray-700 transition-colors">
                  {formatNomProduit(prod.nom, 18)}
                </h3>

                {/* Notes */}
                {prod.note_moyenne && renderStars(prod.note_moyenne)}

                {/* Prix */}
                <div className="space-y-1">
                  {prod.prix_promo === "0.00" ? (
                    <p className="text-lg lg:text-xl font-bold text-gray-900">
                      {parseFloat(prod.prix_vente).toLocaleString()} GNF
                    </p>
                  ) : (
                    <div className="space-y-1">
                      <p className="text-lg lg:text-xl font-bold text-gray-900">
                        {parseFloat(prod.prix_promo).toLocaleString()} GNF
                      </p>
                      <p className="text-sm text-red-500 line-through font-medium">
                        {parseFloat(prod.prix_vente).toLocaleString()} GNF
                      </p>
                    </div>
                  )}
                </div>

                {/* Stock */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 lg:gap-2">
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
                <div className="flex gap-2 pt-1 lg:pt-2">
                  <button 
                    disabled={prod.etat_stock !== "en stock" && prod.etat_stock !== "sur commande"} 
                    onClick={() => handleAjoutPanier(prod)} 
                    className={`flex-1 py-2.5 lg:py-3 rounded-lg lg:rounded-xl text-white text-xs lg:text-sm font-medium transition-all flex items-center justify-center gap-1 lg:gap-2 ${
                      prod.etat_stock === "en stock" || prod.etat_stock === "sur commande"
                        ? "bg-black hover:bg-gray-800 active:scale-95 shadow-md hover:shadow-lg"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    <MdShoppingCart className="text-base lg:text-lg" />
                    <span>Ajouter</span>
                  </button>
                  
                  {/* Bouton vue détail - Visible sur mobile, caché sur desktop (remplacé par l'overlay) */}
                  <button 
                    onClick={() => navigate(`/produit/${prod.slug}`)}
                    className="w-10 lg:w-12 h-10 lg:h-12 border border-gray-300 rounded-lg lg:rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors duration-200"
                  >
                    <FaRegEye size={15} className="lg:w-4 lg:h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Chargement plus pour la pagination */}
        {!loading && filteredProduits.length > 0 && (
          <div className="flex justify-center mt-8 lg:mt-12">
            <button className="px-6 lg:px-8 py-2.5 lg:py-3 border border-gray-300 rounded-xl text-gray-700 text-sm lg:text-base font-medium hover:bg-gray-50 transition-colors duration-200">
              Charger plus de produits
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProduitParCategorie;