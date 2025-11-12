import { useEffect, useState } from "react";
import { FaHeart,  FaEye, FaTrash, FaStar } from "react-icons/fa6";
import { FaShoppingBag } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { getTokens } from "../../utils/auth";
import Swal from "sweetalert2";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
}

interface Categorie {
  id: number;
  nom: string;
  photo: string;
}

interface SousCategorie {
  id: number;
  nom: string;
}

interface Produit {
  id: number;
  nom: string;
  slug: string;
  prix_vente: number;
  prix_promo: number;
  quantite: number;
  etat_stock: string;
  image_principale: string;
  categorie: Categorie;
  sous_categorie: SousCategorie;
  est_publie: boolean;
  vues: number;
  nombres_ventes: number;
}

interface Favori {
  id: number;
  user: User;
  produit: Produit;
  created_at: string;
}

const ContenuFavori = () => {
  const navigate = useNavigate();
  const [favoris, setFavoris] = useState<Favori[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);

  const fetchFavoris = async () => {
    const token = localStorage.getItem("access");
    try {
      const response = await axiosInstance.get("/listProduitFavori/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavoris(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des favoris:", error);
      setFavoris([]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavoris = async (favoriId: number) => {
    const token = localStorage.getItem("access");
    try {
      await axiosInstance.delete(`/supprimer_favori/${favoriId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavoris(favoris.filter(fav => fav.id !== favoriId));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
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
        attribut_valeur: null,
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

  useEffect(() => {
    fetchFavoris();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
          <p className="text-lg text-gray-600">Chargement de vos favoris...</p>
        </div>
      </div>
    );
  }

  if (favoris.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-3xl shadow-sm p-12">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaHeart size={32} className="text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Vos favoris sont vides</h1>
          <p className="text-gray-500 mb-8 text-lg leading-relaxed">
            Découvrez notre gamme de produits BTP et ajoutez vos préférés à cette liste
          </p>
          <button
            onClick={() => navigate("/Boutique")}
            className="bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 w-full shadow-md"
          >
            Découvrir nos produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mes Favoris</h1>
          <div className="w-24 h-1 bg-black mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">
            {favoris.length} produit{favoris.length > 1 ? 's' : ''} dans votre liste de souhaits
          </p>
        </div>

        {/* Grille des produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoris.map((favori) => (
            <div
              key={favori.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-300 group"
              onMouseEnter={() => setHoveredProduct(favori.produit.id)}
              onMouseLeave={() => setHoveredProduct(null)}
            >
              {/* Image du produit */}
              <div className="relative overflow-hidden bg-gray-100">
                <img
                  src={`http://127.0.0.1:8004${favori.produit.image_principale}`}
                  alt={favori.produit.nom}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Badge de statut */}
                <div className="absolute top-3 left-3">
                  {favori.produit.prix_promo > 0 && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      PROMO
                    </span>
                  )}
                </div>

                {/* Actions rapides */}
                <div className={`absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300 ${
                  hoveredProduct === favori.produit.id ? 'opacity-100' : 'opacity-0'
                }`}>
                  <button
                    onClick={() => removeFromFavoris(favori.id)}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-red-50 hover:text-red-500 transition-colors"
                  >
                    <FaTrash className="text-sm" />
                  </button>
                  <button
                    onClick={() => navigate(`/produit/${favori.produit.slug}`)}
                    className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
                  >
                    <FaEye className="text-sm" />
                  </button>
                </div>

                {/* Overlay au survol */}
                {hoveredProduct === favori.produit.id && (
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <button
                      onClick={() => handleAjoutPanier(favori.produit)}
                      className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 flex items-center gap-2"
                    >
                      <FaShoppingBag />
                      Ajouter au panier
                    </button>
                  </div>
                )}
              </div>

              {/* Informations du produit */}
              <div className="p-4">
                {/* Catégorie */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 uppercase tracking-wide">
                    {favori.produit.categorie.nom}
                  </span>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400 text-sm" />
                    <span className="text-xs text-gray-500">({favori.produit.vues})</span>
                  </div>
                </div>

                {/* Nom du produit */}
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 h-12">
                  {favori.produit.nom}
                </h3>

                {/* Prix */}
                <div className="flex items-center gap-2 mb-3">
                  {favori.produit.prix_promo > 0 ? (
                    <>
                      <span className="text-lg font-bold text-gray-900">
                        {favori.produit.prix_promo.toLocaleString()} GNF
                      </span>
                      <span className="text-sm text-gray-500 line-through">
                        {favori.produit.prix_vente.toLocaleString()} GNF
                      </span>
                    </>
                  ) : (
                    <span className="text-lg font-bold text-gray-900">
                      {favori.produit.prix_vente.toLocaleString()} GNF
                    </span>
                  )}
                </div>

                {/* Stock */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    favori.produit.etat_stock === "rupture stock" 
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                    {favori.produit.etat_stock === "rupture stock" ? "Rupture" : "En stock"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {favori.produit.quantite} unités
                  </span>
                </div>

                {/* Bouton d'action principal */}
                <button
                  onClick={() => handleAjoutPanier(favori.produit)}
                  className="w-full mt-4 bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <FaShoppingBag />
                  Ajouter au panier
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton de retour */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/Boutique")}
            className="border-2 border-gray-300 text-gray-700 px-8 py-3 rounded-xl font-semibold hover:border-black hover:bg-black hover:text-white transition-all duration-200"
          >
            Continuer mes achats
          </button>
        </div>

        {/* Statistiques */}
        <div className="mt-16 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Vos préférences</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <FaHeart className="text-red-500 text-2xl mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 text-lg">Total des favoris</h3>
              <p className="text-3xl font-bold text-black mt-2">{favoris.length}</p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <FaEye className="text-blue-500 text-2xl mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 text-lg">Produits les plus vus</h3>
              <p className="text-3xl font-bold text-black mt-2">
                {Math.max(...favoris.map(f => f.produit.vues))}
              </p>
            </div>
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <FaShoppingBag className="text-green-500 text-2xl mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 text-lg">Catégories préférées</h3>
              <p className="text-3xl font-bold text-black mt-2">
                {new Set(favoris.map(f => f.produit.categorie.nom)).size}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContenuFavori;