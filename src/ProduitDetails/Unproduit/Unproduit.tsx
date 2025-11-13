import { useEffect, useState } from "react";
import { FaHeart, FaShareAlt, FaMinus, FaPlus, FaShoppingCart, FaTruck, FaShieldAlt, FaStar, FaCheck, FaArrowLeft } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Swal from "sweetalert2";
import { getTokens } from "../../utils/auth";

interface Produit {
  id: number;
  nom: string;
  slug: string;
  sku: string;
  type_produit: string;
  description_courte: string;
  description_longue: string;
  prix_fournisseur: string;
  prix_promo: string;
  prix_vente: string;
  quantite: number;
  etat_stock: string;
  livraison_gratuite: boolean;
  est_original: boolean;
  caracteristiques: any;
  status: string;
  categorie: {
    id: number;
    nom: string;
    gros_categorie: string;
  };
  sous_categorie: {
    id: number;
    nom: string;
  };
  etiquette: {
    id: number;
    name: string;
    description: string;
  };
  image_principale: string;
  vues: number;
  nombres_ventes: number;
  created_at: string;
  largeur?: string;
  longueur?: string;
  poids?: string;
  hauteur?: string;
  superficie?: string;
  taille?: string;
  materiau?: string;
}

export default function ProductPage() {
  const [mainIndex, setMainIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [verification, setVerification] = useState(false);
  const [images, setImage] = useState<{ image: string }[]>([]);
  const [produit, setProduit] = useState<Produit | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'description' | 'caracteristiques'>('description');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  const { slug } = useParams();
  const navigate = useNavigate();

  // Détection de la taille d'écran
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Format price function
  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('fr-FR').format(parseFloat(price));
  };

  // Calculate discount percentage
  const calculateDiscount = () => {
    if (!produit || parseFloat(produit.prix_promo) === 0) return 0;
    const original = parseFloat(produit.prix_fournisseur);
    const sale = parseFloat(produit.prix_vente);
    return Math.round(((original - sale) / original) * 100);
  };

  // Fetch produit
  useEffect(() => {
    const fetchProduit = async (slug: any) => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`https://durama-project.onrender.com/produits/${slug}/`);
        setProduit(response.data);
      } catch (err: any) {
        console.log(err.message);
        Swal.fire({
          icon: "error",
          title: "Erreur",
          text: "Impossible de charger le produit",
          confirmButtonColor: "#000000",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchProduit(slug);
  }, [slug]);

  useEffect(() => {
    const fetchData = async () => {
      if (!produit || !produit.id) return;

      try {
        const response = await axiosInstance.get(
          `https://durama-project.onrender.com/verification/${produit.id}/`
        );
        setVerification(response.data.existe);
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

  const handleFavoris = async (prod: Produit) => {
    try {
      await axiosInstance.post(`https://durama-project.onrender.com/unProduitCommeFavorie/${prod.id}/`, {
        produit_id: prod.id
      });
      const response = await axiosInstance.get(
        `https://durama-project.onrender.com/verification/${prod.id}/`
      );
      setVerification(response.data.existe);
      Swal.fire({
        icon: "success",
        title: "Ajouté aux favoris ❤️",
        text: "Produit ajouté à votre liste de souhaits",
        confirmButtonColor: "#000000",
        timer: 1500,
      });
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const handleDeleteFavoris = async (prod: Produit) => {
    try {
      await axiosInstance.delete(`https://durama-project.onrender.com/supprimer_favori/${prod.id}/`);
      const response = await axiosInstance.get(
        `https://durama-project.onrender.com/verification/${prod.id}/`
      );
      setVerification(response.data.existe);
      Swal.fire({
        icon: "success",
        title: "Retiré des favoris",
        text: "Produit retiré de votre liste de souhaits",
        confirmButtonColor: "#000000",
        timer: 1500,
      });
    } catch (err: any) {
      console.log(err.message);
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
        confirmButtonText: "Se connecter",
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
        quantite: quantity,
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
          <p className="text-gray-600">Chargement du produit...</p>
        </div>
      </div>
    );
  }

  if (!produit) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Produit non trouvé</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  const discount = calculateDiscount();

  // VERSION MOBILE
  if (isMobile) {
    return (
      <div className="bg-white text-black min-h-screen safe-area-bot">
        {/* Header Mobile Fixe */}
        <div className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            {/*<button 
              onClick={() => navigate(-1)}
              className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm"
            >
              <FaArrowLeft className="text-gray-600" size={16} />
            </button>*/}
            
            <h1 className="text-lg font-bold truncate max-w-[140px] text-center">
              {produit.nom}
            </h1>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => verification ? handleDeleteFavoris(produit) : handleFavoris(produit)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                  verification 
                    ? "bg-red-500 text-white" 
                    : "bg-white border border-gray-200 text-gray-600 shadow-sm"
                }`}
              >
                <FaHeart className={verification ? "fill-current" : ""} size={16} />
              </button>
              <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-600 shadow-sm">
                <FaShareAlt size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Contenu Principal Mobile */}
        <div className="pt-16 pb-32">
          {/* Gallery d'Images */}
          <div className="relative">
            <div className="w-full bg-gray-50 overflow-hidden">
              <img
                src={`https://durama-project.onrender.com${images.length > 0 ? images[mainIndex].image : produit.image_principale}`}
                alt={produit.nom}
                className="w-full aspect-square object-cover"
              />
            </div>
            
            {/* Badges sur l'image */}
            <div className="absolute top-3 left-3 right-3 flex justify-between">
              <div className="flex gap-2">
                {discount > 0 && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                    -{discount}%
                  </span>
                )}
                {produit.est_original && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                    Original
                  </span>
                )}
              </div>
              {produit.etiquette && (
                <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                  {produit.etiquette.name}
                </span>
              )}
            </div>

            {/* Indicateur de slides */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <div className="flex gap-1">
                  {images.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === mainIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Thumbnails Scrollables */}
          {images.length > 1 && (
            <div className="px-4 py-3 border-b border-gray-100">
              <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setMainIndex(i)}
                    className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      mainIndex === i ? "border-black shadow-sm" : "border-gray-300"
                    }`}
                  >
                    <img 
                      src={`https://durama-project.onrender.com${src.image}`} 
                      alt={`Vue ${i + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Informations Produit Mobile */}
          <div className="px-4 py-4 space-y-4">
            
            {/* Catégorie et SKU */}
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>{produit.categorie.nom} • {produit.sous_categorie.nom}</span>
              {/*<span>SKU: {produit.sku}</span>*/}
            </div>

            {/* Nom du Produit */}
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              {produit.nom}
            </h1>

            {/* Prix */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-black">
                {formatPrice(produit.prix_vente)} GNF
              </span>
              {discount > 0 && (
                <span className="text-lg line-through text-gray-400">
                  {formatPrice(produit.prix_fournisseur)} GNF
                </span>
              )}
            </div>

            {/* Statut Stock */}
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
              produit.etat_stock === 'en stock' ? 'bg-green-100 text-green-800' : 
              produit.etat_stock === 'sur commande' ? 'bg-blue-100 text-blue-800' : 
              'bg-red-100 text-red-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                produit.etat_stock === 'en stock' ? 'bg-green-500' : 
                produit.etat_stock === 'sur commande' ? 'bg-blue-500' : 
                'bg-red-500'
              }`}></div>
              <span className="font-medium text-sm capitalize">{produit.etat_stock}</span>
              {produit.quantite > 0 && (
                <span className="text-sm">({produit.quantite} restants)</span>
              )}
            </div>

            {/* Description Courte */}
            <p className="text-gray-700 leading-relaxed text-base">
              {produit.description_courte}
            </p>

            {/* Avantages */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                <FaCheck className="text-green-600 flex-shrink-0" size={14} />
                <span className="text-sm text-green-800">Produit authentique garanti</span>
              </div>
              {produit.livraison_gratuite && (
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                  <FaTruck className="text-blue-600 flex-shrink-0" size={14} />
                  <span className="text-sm text-blue-800">Livraison gratuite</span>
                </div>
              )}
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-xl border border-purple-200">
                <FaShieldAlt className="text-purple-600 flex-shrink-0" size={14} />
                <span className="text-sm text-purple-800">Paiement sécurisé</span>
              </div>
            </div>

            {/* Sélecteur de Quantité */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantité</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-12 h-12 flex items-center justify-center text-gray-600 active:bg-gray-100 transition-colors"
                  >
                    <FaMinus size={14} />
                  </button>
                  <div className="w-12 h-12 flex items-center justify-center font-semibold text-lg border-x border-gray-200 bg-white">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-12 h-12 flex items-center justify-center text-gray-600 active:bg-gray-100 transition-colors"
                  >
                    <FaPlus size={14} />
                  </button>
                </div>
                
                <div className="text-sm text-gray-600 text-right">
                  <div>{quantity} {quantity > 1 ? "unités" : "unité"}</div>
                  <div className="font-semibold text-black">
                    Total: {formatPrice((parseFloat(produit.prix_vente) * quantity).toString())} GNF
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('description')}
                  className={`flex-1 py-4 text-center font-medium border-b-2 transition-colors ${
                    activeTab === 'description' 
                      ? 'border-black text-black' 
                      : 'border-transparent text-gray-500'
                  }`}
                >
                  Description
                </button>
                <button
                  onClick={() => setActiveTab('caracteristiques')}
                  className={`flex-1 py-4 text-center font-medium border-b-2 transition-colors ${
                    activeTab === 'caracteristiques' 
                      ? 'border-black text-black' 
                      : 'border-transparent text-gray-500'
                  }`}
                >
                  Caractéristiques
                </button>
              </div>
            </div>

            {/* Contenu des Tabs */}
            <div className="py-4">
              {activeTab === 'description' ? (
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {produit.description_longue}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {produit.largeur && (
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600">Largeur</span>
                      <span className="font-medium">{produit.largeur}</span>
                    </div>
                  )}
                  {produit.longueur && (
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600">Longueur</span>
                      <span className="font-medium">{produit.longueur}</span>
                    </div>
                  )}
                  {produit.poids && (
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600">Poids</span>
                      <span className="font-medium">{produit.poids}</span>
                    </div>
                  )}
                  {produit.hauteur && (
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600">Hauteur</span>
                      <span className="font-medium">{produit.hauteur}</span>
                    </div>
                  )}
                  {produit.taille && (
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600">Taille</span>
                      <span className="font-medium">{produit.taille}</span>
                    </div>
                  )}
                  {produit.materiau && (
                    <div className="flex justify-between py-3 border-b border-gray-100">
                      <span className="text-gray-600">Matériau</span>
                      <span className="font-medium">{produit.materiau}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Statistiques */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <FaStar className="text-yellow-400" size={14} />
                  <span>{produit.vues} vues</span>
                </div>
                <span>{produit.nombres_ventes} ventes</span>
                <span>Ajouté le {new Date(produit.created_at).toLocaleDateString('fr-FR')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar Fixe Mobile */}
        <div className=" fixed -mt-40 bottom-15 to left-0 right-0 bg-white border-t border-gray-200 p-4 safe-area-bot shadow-2xl">
          <div className="flex items-center gap-3">
            {/*<div className="flex items-center bg-white border border-gray-300 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
              <button 
                onClick={() => setQuantity(q => Math.max(1, q - 1))} 
                className="w-12 h-12 flex items-center justify-center text-gray-600 active:bg-gray-100"
              >
                <FaMinus size={14} />
              </button>
              <div className="w-12 h-12 flex items-center justify-center font-semibold border-x border-gray-200">
                {quantity}
              </div>
              <button 
                onClick={() => setQuantity(q => q + 1)} 
                className="w-12 h-12 flex items-center justify-center text-gray-600 active:bg-gray-100"
              >
                <FaPlus size={14} />
              </button>
            </div>*/}
            
            <button 
              onClick={() => handleAjoutPanier(produit)}
              disabled={produit.quantite === 0}
              className={`flex-1 bg-black text-white rounded-xl font-bold py-4 flex items-center justify-center gap-3 transition-colors ${
                produit.quantite === 0 ? "opacity-50 cursor-not-allowed" : "active:bg-gray-800 active:scale-95"
              }`}
            >
              <FaShoppingCart size={18} />
              {produit.quantite === 0 ? "Rupture de stock" : `Ajouter `}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // VERSION DESKTOP
  return (
    <div className="bg-white text-black min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
          <span>Accueil</span>
          <span>/</span>
          <span>{produit.categorie.nom}</span>
          <span>/</span>
          <span>{produit.sous_categorie.nom}</span>
          <span>/</span>
          <span className="text-black font-medium">{produit.nom}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Gallery Desktop */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative w-full bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
              {discount > 0 && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-red-500 text-white px-3 py-2 rounded-full text-sm font-bold">
                    -{discount}%
                  </span>
                </div>
              )}
              {produit.etiquette && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-blue-500 text-white px-3 py-2 rounded-full text-sm font-bold">
                    {produit.etiquette.name}
                  </span>
                </div>
              )}
              {produit.est_original && (
                <div className="absolute top-16 left-4 z-10">
                  <span className="bg-green-500 text-white px-3 py-2 rounded-full text-sm font-bold">
                    Original ⭐
                  </span>
                </div>
              )}
              <img
                src={`https://durama-project.onrender.com${images.length > 0 ? images[mainIndex].image : produit.image_principale}`}
                alt={produit.nom}
                className="w-full aspect-square object-cover"
              />
            </div>

            {/* Thumbnails Desktop */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 hide-scrollbar">
                {images.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setMainIndex(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                      mainIndex === i ? "border-black shadow-md" : "border-gray-300 hover:border-gray-400"
                    }`}
                    aria-label={`Voir l'image ${i + 1}`}
                  >
                    <img 
                      src={`https://durama-project.onrender.com${src.image}`} 
                      alt={`Vue ${i + 1}`} 
                      className="w-full h-full object-cover" 
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Info Desktop */}
          <div className="flex flex-col space-y-8">
            {/* Product Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    SKU: {produit.sku}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FaStar className="text-yellow-400" />
                  <span>{produit.vues} vues</span>
                  <span>•</span>
                  <span>{produit.nombres_ventes} ventes</span>
                </div>
              </div>

              <h1 className="text-4xl font-bold leading-tight text-gray-900">
                {produit.nom}
              </h1>

              <div className="flex items-center gap-4">
                <div className="flex items-baseline gap-4">
                  <span className="text-5xl font-black text-black">
                    {formatPrice(produit.prix_vente)} GNF
                  </span>
                  {discount > 0 && (
                    <span className="text-2xl line-through text-gray-400">
                      {formatPrice(produit.prix_fournisseur)} GNF
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Stock Status */}
            <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl ${
              produit.etat_stock === 'en stock' ? 'bg-green-100 text-green-800' : 
              produit.etat_stock === 'sur commande' ? 'bg-blue-100 text-blue-800' : 
              'bg-red-100 text-red-800'
            }`}>
              <div className={`w-3 h-3 rounded-full ${
                produit.etat_stock === 'en stock' ? 'bg-green-500' : 
                produit.etat_stock === 'sur commande' ? 'bg-blue-500' : 
                'bg-red-500'
              }`}></div>
              <span className="font-semibold text-lg capitalize">{produit.etat_stock}</span>
              {produit.quantite > 0 && (
                <span className="text-sm">({produit.quantite} unités disponibles)</span>
              )}
            </div>

            {/* Short Description */}
            <p className="text-gray-700 leading-relaxed text-lg">
              {produit.description_courte}
            </p>

            {/* Product Specifications */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Caractéristiques principales</h3>
              <div className="grid grid-cols-2 gap-4">
                {produit.largeur && (
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Largeur</span>
                    <span className="font-medium">{produit.largeur}</span>
                  </div>
                )}
                {produit.longueur && (
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Longueur</span>
                    <span className="font-medium">{produit.longueur}</span>
                  </div>
                )}
                {produit.poids && (
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Poids</span>
                    <span className="font-medium">{produit.poids}</span>
                  </div>
                )}
                {produit.hauteur && (
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Hauteur</span>
                    <span className="font-medium">{produit.hauteur}</span>
                  </div>
                )}
                {produit.taille && (
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Taille</span>
                    <span className="font-medium">{produit.taille}</span>
                  </div>
                )}
                {produit.materiau && (
                  <div className="flex justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">Matériau</span>
                    <span className="font-medium">{produit.materiau}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Quantité</h3>
              <div className="flex items-center gap-6">
                <div className="flex items-center bg-white border border-gray-300 rounded-xl overflow-hidden shadow-sm">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-14 h-14 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    aria-label="Réduire la quantité"
                  >
                    <FaMinus size={16} />
                  </button>
                  <div className="w-14 h-14 flex items-center justify-center font-semibold text-xl border-x border-gray-200 bg-white">
                    {quantity}
                  </div>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-14 h-14 flex items-center justify-center text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                    aria-label="Augmenter la quantité"
                  >
                    <FaPlus size={16} />
                  </button>
                </div>

                <div className="text-lg text-gray-600">
                  <div>{quantity} {quantity > 1 ? "unités" : "unité"} sélectionnée{quantity > 1 ? "s" : ""}</div>
                  <div className="font-bold text-black text-xl">
                    Total: {formatPrice((parseFloat(produit.prix_vente) * quantity).toString())} GNF
                  </div>
                </div>
              </div>
            </div>

            {/* Features & Benefits */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Avantages</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
                  <FaCheck className="text-green-600 flex-shrink-0" size={18} />
                  <span className="text-green-800">Produit authentique</span>
                </div>
                {produit.livraison_gratuite && (
                  <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <FaTruck className="text-blue-600 flex-shrink-0" size={18} />
                    <span className="text-blue-800">Livraison gratuite</span>
                  </div>
                )}
                <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <FaShieldAlt className="text-purple-600 flex-shrink-0" size={18} />
                  <span className="text-purple-800">Paiement sécurisé</span>
                </div>
              </div>
            </div>

            {/* Action Buttons Desktop */}
            <div className="flex  gap-4 pt-6 ">
              <div className="flex gap-3">
                <button
                  onClick={() => verification ? handleDeleteFavoris(produit) : handleFavoris(produit)}
                  className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200 border ${
                    verification 
                      ? "bg-red-500 text-white border-red-500 hover:bg-red-600" 
                      : "bg-white text-gray-600 border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  <FaHeart className={verification ? "fill-current" : ""} size={22} />
                </button>
                <button className="w-14 h-14 rounded-xl bg-white border border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 hover:bg-gray-50 transition-all duration-200">
                  <FaShareAlt size={20} />
                </button>
              </div>
              
              <button
                onClick={() => handleAjoutPanier(produit)}
                disabled={produit.quantite === 0}
                className={`flex-1 flex items-center justify-center  gap-4 rounded-xl h-16 font-bold text-xl transition-all duration-200 ${
                  produit.quantite === 0
                    ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800 active:scale-95"
                }`}
              >
                <FaShoppingCart size={24} />
                {produit.quantite === 0 ? "Rupture de stock" : `Ajouter au panier - ${formatPrice(produit.prix_vente)} GNF`}
              </button>
            </div>
          </div>
        </div>

        {/* Long Description Section Desktop */}
        <div className="mt-16 border-t border-gray-200 pt-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Description détaillée</h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed whitespace-pre-line text-lg">
                {produit.description_longue}
              </p>
            </div>
          </div>
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
        `}
      </style>
    </div>
  );
}