import { MdShoppingCart,  MdStar, MdLocalShipping } from "react-icons/md";
import { IoCubeOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import Swal from "sweetalert2";
import { getTokens } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

interface Produit {
  id: number;
  nom: string;
  categorie: {
    gros_categorie: string;
  };
  description_courte: string;
  prix_vente: string;
  prix_promo: string;
  image_principale: string;
  etat_stock: string;
  note_moyenne?: number;
  livraison_gratuite?: boolean;
}

const ProduitsRecents = () => {
  const [quatreProduits, setQuatreProduits] = useState<Produit[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const formatNomProduit = (nom: string, maxLength: number = 20) => {
    if (!nom) return "";
    return nom.length > maxLength ? nom.slice(0, maxLength) + "…" : nom;
  };
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get("/quatres-dernier-produits/");
        // Ajouter des données simulées pour la démo
        const produitsAvecDetails = response.data.map((prod: any) => ({
          ...prod,
          note_moyenne: Math.random() * 2 + 3, // Note entre 3 et 5
           
        }));
        setQuatreProduits(produitsAvecDetails);
      } catch (err: any) {
        console.log(err.message);
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Impossible de charger les produits récents",
          confirmButtonColor: "#d33",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
    <div className="bg-white py-12 sm:py-20">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* En-tête amélioré */}
        <div className="text-center mb-12 sm:mb-16">

          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
            Nos Produits Récemment Ajoutés
          </h2>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Découvrez en avant-première les dernières innovations et produits ajoutés à notre catalogue BTP.
          </p>
        </div>

        {/* Indicateur de chargement */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        )}

        {/* Grille des produits - STYLE MODERNE MOBILE */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          {quatreProduits.map((prod, index) => (
            <div
              key={index}
              className="bg-white rounded-xl  border border-[#b5e955] overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              {/* Image avec badges */}
              <div className="relative">
                <img
                  src={`https://durama-project.onrender.com${prod.image_principale}`}
                  alt={prod.nom}
                  className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
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

                {/* Badge Nouveau */}
                <div className="absolute bottom-2 left-2 bg-black text-white px-2 py-1 rounded text-xs font-medium">
                  NOUVEAU
                </div>
              </div>

              {/* Contenu de la carte */}
              <div className="p-3 sm:p-4 space-y-2">
                {/* Catégorie */}
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                  {prod.categorie.gros_categorie}
                </p>

                {/* Nom du produit */}
                <h3 className="font-bold text-gray-900 text-sm leading-tight line-clamp-2 min-h-[2.5rem]">
                  {formatNomProduit(prod.nom, 18)}
                </h3>

                {/* Description (masquée sur mobile) */}
                <p className="text-gray-600 text-xs hidden sm:block line-clamp-2">
                  {prod.description_courte}
                </p>

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
                  
                  <button className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors text-sm">
                    <FaRegEye  className="text-black" size={15}/>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bouton "Voir plus" */}

      </div>
    </div>
  );
};

export default ProduitsRecents;