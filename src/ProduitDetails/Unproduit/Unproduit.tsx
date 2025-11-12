import { useEffect, useState } from "react";
import { FaHeart, FaShareAlt, FaMinus, FaPlus, FaShoppingCart } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Swal from "sweetalert2";
import { getTokens } from "../../utils/auth";

interface Produit {
  id: number;
  nom: string;
  categorie: {
    gros_categorie: string;
  };
  description_courte: string;
  description_longue?: string;
  prix_vente: string;
  prix_promo?: string;
  slug: string;
  image_principale: string;
  etat_stock: string;
  note_moyenne?: number;
  livraison_gratuite?: boolean;
}

export default function ProductPage() {
  const [mainIndex, setMainIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  
  const [verification,setVerification]=useState(Boolean)
  const [images, setImage] = useState<{ image: string }[]>([]);
  const [produit, setProduit] = useState<Produit | null>(null);

  const { slug } = useParams();
  const navigate = useNavigate();

  // Fetch produit
  useEffect(() => {
    const fetchProduit = async (slug: any) => {
      try {
        const response = await axiosInstance.get(`https://durama-project.onrender.com/produits/${slug}/`);
        setProduit(response.data);
      } catch (err: any) {
        console.log(err.message);
      }
    };
    fetchProduit(slug);
  }, [slug]);

useEffect(() => {
  const fetchData = async () => {
    if (!produit || !produit.id) return; // ✅ attend que produit soit chargé

    try {
      const response = await axiosInstance.get(
        `https://durama-project.onrender.com/verification/${produit.id}/`
      );
      setVerification(response.data.existe); 
      console.log(response.data);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  fetchData();
}, [produit]);


  // Fetch images
  useEffect(() => {
    const fetchImages = async (slug: any) => {
      try {
        const response = await axiosInstance.get(`https://durama-project.onrender.com/images_un_produit/${slug}/`);
        setImage(response.data);
      } catch (err: any) {
        console.log(err.message);
      }
    };
    fetchImages(slug);
  }, [slug]);
  const handleFavoris = async (prod:Produit)=>{
    try{
       await axiosInstance.post(`https://durama-project.onrender.com/unProduitCommeFavorie/${prod.id}/`,{
        produit_id:prod.id
      })
        const response = await axiosInstance.get(
        `https://durama-project.onrender.com/verification/${prod.id}/`
      );
      setVerification(response.data.existe); 
      console.log("ajout")
    }catch(err:any){
      console.log(err.message)
    }

  }
    const handleDeleteFavoris = async (prod:Produit)=>{
    try{
       await axiosInstance.delete(`https://durama-project.onrender.com/supprimer_favori/${prod.id}/`)
             const response = await axiosInstance.get(
        `https://durama-project.onrender.com/verification/${prod.id}/`
      );
      setVerification(response.data.existe); 
      console.log("suppression")
    }catch(err:any){
      console.log(err.message)
    }

  }
  

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
      const response = await axiosInstance.post("https://durama-project.onrender.com/panier/items/", {
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

  // Affichage loader si produit non chargé
  if (!produit) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Chargement du produit...</p>
      </div>
    );
  }

  return (
    <div className="bg-white text-black min-h-screen safe-area-bot">
      {/* Header Mobile */}
      <div className="lg:hidden sticky top-0 bg-white z-10 border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between">
          <button className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold truncate max-w-[200px]">Peau Radieuse</h1>
          <button className="p-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7h14" />
            </svg>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Left Gallery */}
          <div className="space-y-4 lg:space-y-6">
            <div className="w-full bg-gray-50 rounded-xl lg:rounded-2xl overflow-hidden border border-gray-200 touch-pan-y">
              <img
                src={`https://durama-project.onrender.com${images.length > 0 ? images[mainIndex].image : produit?.image_principale ?? ""}`}
                alt={produit.nom ?? "Produit principal"}
                className="w-full aspect-square object-cover"
              />
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setMainIndex(i)}
                  className={`flex-shrink-0 w-16 h-16 lg:w-20 lg:h-20 rounded-lg lg:rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    mainIndex === i ? "border-black shadow-md" : "border-gray-300"
                  }`}
                  aria-label={`Voir l'image ${i + 1}`}
                >
                  <img src={`https://durama-project.onrender.com${src.image}`} alt={`Vue ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Info */}
          <div className="flex flex-col space-y-6 lg:space-y-8 pb-20 lg:pb-0">
            {/* Header Info */}
            <div className="space-y-4">
              <div className="text-xs lg:text-sm font-medium text-gray-500 uppercase tracking-wide">
                {produit?.categorie?.gros_categorie ?? "Catégorie"}
              </div>

              <h1 className="text-xl lg:text-3xl font-bold leading-tight text-gray-900">
                {produit?.nom ?? ""}
              </h1>

              <div className="flex items-center justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl lg:text-4xl font-black text-black">{produit?.prix_vente ?? ""}</span>
                  <span className="text-base lg:text-lg font-medium text-gray-600">GNF</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => verification ?handleDeleteFavoris(produit):handleFavoris(produit)}
                    className={`w-10 h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
                      verification ? "bg-red-50 text-red-500" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <FaHeart className={verification ? "fill-current" : ""} size={18} />
                  </button>
                  <button className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors duration-200">
                    <FaShareAlt size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Variants */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="text-sm lg:text-base font-semibold mb-2 text-gray-900">Variantes</h3>
              <div className="text-gray-600 text-sm">Produit unique - 60 gélules</div>
            </div>

            {/* Quantity */}
            <div className="space-y-3">
              <h3 className="text-sm lg:text-base font-semibold text-gray-900">Quantité</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center bg-white border border-gray-300 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-600 active:bg-gray-100 transition-colors"
                    aria-label="Réduire la quantité"
                  >
                    <FaMinus size={14} />
                  </button>
                  <div className="w-12 h-12 flex items-center justify-center font-semibold text-lg border-x border-gray-200">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-12 h-12 flex items-center justify-center text-gray-600 active:bg-gray-100 transition-colors"
                    aria-label="Augmenter la quantité"
                  >
                    <FaPlus size={14} />
                  </button>
                </div>

                <div className="text-sm text-gray-600 flex-1">
                  {quantity} {quantity > 1 ? "boîtes" : "boîte"} sélectionnée{quantity > 1 ? "s" : ""}
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-sm lg:text-base font-semibold text-gray-900">Caractéristiques</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  </div>
                  <span className="text-gray-700 text-sm lg:text-base">Usage : 2 gélules par jour</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  </div>
                  <span className="text-gray-700 text-sm lg:text-base">Durée : 30 jours</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
                  </div>
                  <span className="text-gray-700 text-sm lg:text-base">Formule : Nettle, Burdock, MSM, Lactoferrin</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3">
              <h3 className="text-sm lg:text-base font-semibold text-gray-900">Description</h3>
              <p className="text-gray-700 leading-relaxed text-sm lg:text-base">
                {produit?.description_longue ?? ""}
              </p>
            </div>

            {/* Ajouter au panier */}
            <div className="px-2 py-2 w-full">
              <button
                onClick={() => produit && handleAjoutPanier(produit)}
                className="w-full items-center justify-center rounded-2xl bg-black h-[50px]"
              >
                <p className="font-bold text-white">Ajouter au panier</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-bot">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-gray-300 rounded-xl overflow-hidden flex-shrink-0">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 flex items-center justify-center text-gray-600 active:bg-gray-100">
              <FaMinus size={12} />
            </button>
            <button className="w-10 h-10 flex items-center justify-center font-semibold text-sm border-x border-gray-200">{quantity}</button>
            <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 flex items-center justify-center text-gray-600 active:bg-gray-100">
              <FaPlus size={12} />
            </button>
          </div>
          <button className="flex-1 bg-black text-white rounded-xl font-semibold py-3 flex items-center justify-center gap-2 active:bg-gray-800 transition-colors">
            <FaShoppingCart size={16} />
            Ajouter - 289 000 GNF
          </button>
        </div>
      </div>

<style>
{`
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .safe-area-bot {
    padding-bottom: env(safe-area-inset-bottom);
  }
  @media (max-width: 1024px) {
    .touch-pan-y {
      touch-action: pan-y;
    }
  }
`}
</style>

    </div>
  );
}
