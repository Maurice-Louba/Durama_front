import { useEffect, useState } from "react";
import { FaHeart,  FaEye, FaTrash, FaStar } from "react-icons/fa6";
import {FaShoppingBag}  from "react-icons/fa"
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Swal from "sweetalert2";
import { getTokens } from "../../utils/auth";
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

  const removeFromFavoris = async (favoriId:number) => {
    const token = localStorage.getItem("access");
    try {
      await axiosInstance.delete(`/supprimer_favori/${favoriId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFavoris()
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-black mb-4"></div>
          <p className="text-lg text-gray-600 text-center">Chargement de vos favoris...</p>
        </div>
      </div>
    );
  }

  if (favoris.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center bg-white rounded-2xl shadow-sm p-8">
          <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaHeart size={40} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Vos favoris sont vides</h1>
          <p className="text-gray-500 mb-8 text-base leading-relaxed">
            Découvrez notre gamme de produits BTP et ajoutez vos préférés à cette liste
          </p>
          <button
            onClick={() => navigate("/Boutique")}
            className="bg-black text-white px-6 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 w-full shadow-md text-lg"
          >
            Découvrir nos produits
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header fixe */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-4">
          <div className="flex items-center justify-center">
            {/*<button 
              onClick={() => navigate(-1)}
              className="p-2 rounded-lg bg-gray-100"
            >
              <FaArrowLeft className="text-lg" />
            </button>*/}
            <h1 className="text-xl font-bold text-gray-900">Mes Favoris</h1>
             {/* Pour l'équilibrage */}
          </div>
          <p className="text-gray-600 text-center mt-2 text-sm">
            {favoris.length} produit{favoris.length > 1 ? 's' : ''} dans votre liste
          </p>
        </div>
      </div>

      {/* Liste des produits */}
      <div className="px-4 py-6 space-y-4">
        {favoris.map((favori) => (
          <div
            key={favori.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
          >
            <div className="flex p-4">
              {/* Image du produit */}
              <div className="relative flex-shrink-0">
                <img
                  src={`https://durama-project.onrender.com${favori.produit.image_principale}`}
                  alt={favori.produit.nom}
                  className="w-24 h-24 object-cover rounded-xl bg-gray-100"
                />
                {/* Badge promo */}
                {favori.produit.prix_promo > 0 && (
                  <span className="absolute -top-1 -left-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                    PROMO
                  </span>
                )}
              </div>

              {/* Informations du produit */}
              <div className="flex-1 ml-4 min-w-0">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-base line-clamp-2 mb-1">
                      {favori.produit.nom}
                    </h3>
                    <p className="text-xs text-gray-500 uppercase mb-2">
                      {favori.produit.categorie.nom}
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromFavoris(favori.produit.id)}
                    className="flex-shrink-0 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2"
                  >
                    <FaTrash className="text-base" />
                  </button>
                </div>

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

                {/* Stock et évaluation */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    favori.produit.etat_stock === "rupture stock" 
                      ? "bg-red-100 text-red-800"
                      : "bg-green-100 text-green-800"
                  }`}>
                    {favori.produit.etat_stock === "rupture stock" ? "Rupture" : "En stock"}
                  </span>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400 text-sm" />
                    <span className="text-xs text-gray-500">({favori.produit.vues})</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/produit/${favori.produit.slug}`)}
                    className="flex-1 border border-gray-300 text-gray-700 py-2 px-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <FaEye className="text-sm" />
                    Voir
                  </button>
                  <button
                    onClick={() => handleAjoutPanier(favori.produit)}
                    className="flex-1 bg-black text-white py-2 px-3 rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    <FaShoppingBag className="text-sm" />
                    Panier
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bouton flottant pour continuer les achats */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg">
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/Boutique")}
            className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold hover:border-black hover:bg-black hover:text-white transition-all duration-200 text-base"
          >
            Voir la boutique
          </button>
          <div className="bg-gray-100 rounded-xl px-4 flex items-center justify-center min-w-16">
            <FaHeart className="text-red-500 mr-2" />
            <span className="font-bold text-gray-900">{favoris.length}</span>
          </div>
        </div>
      </div>

      {/* Section statistiques simplifiée */}
      <div className="px-4 mt-6 mb-20">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 text-center">Vos préférences</h2>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <FaHeart className="text-red-500 text-lg mx-auto mb-1" />
              <p className="text-xs text-gray-600">Favoris</p>
              <p className="text-lg font-bold text-black">{favoris.length}</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <FaEye className="text-blue-500 text-lg mx-auto mb-1" />
              <p className="text-xs text-gray-600">Plus vus</p>
              <p className="text-lg font-bold text-black">
                {Math.max(...favoris.map(f => f.produit.vues))}
              </p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <FaShoppingBag className="text-green-500 text-lg mx-auto mb-1" />
              <p className="text-xs text-gray-600">Catégories</p>
              <p className="text-lg font-bold text-black">
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