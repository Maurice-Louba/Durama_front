import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GrShop } from "react-icons/gr";
import { FaTrash, FaTruck, FaCalendarAlt, FaClock, FaPlus, FaMinus } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";

interface Produit {
  id: number;
  nom: string;
  prix_vente: number;
  image_principale: string;
}

interface PanierItem {
  id: number;
  quantite: number;
  produit: Produit;
}

const ContenuPanier = () => {
  const navigate = useNavigate();
  const [produits, setProduits] = useState<PanierItem[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    const token = localStorage.getItem("access");
    try {
      const response = await axiosInstance.get("/prix_total/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTotal(response.data);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const fetchPanier = async () => {
    const token = localStorage.getItem("access");
    try {
      const res = await axiosInstance.get("/panier/items/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProduits(res.data);
    } catch (error) {
      console.error(error);
      setProduits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuantite = async (id: any) => {
    const token = localStorage.getItem("access");
    try {
      await axiosInstance.post(`/changer_quantiter/${id}/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPanier();
      fetchData();
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const handleDiminuer = async (id: any) => {
    const token = localStorage.getItem("access");
    try {
      await axiosInstance.post(`/diminuer_quantiter/${id}/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPanier();
      fetchData();
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const handleDelete = async (id: any) => {
    try {
      await axiosInstance.delete(`/supprimer_un_item/${id}/`);
      fetchPanier();
      fetchData();
    } catch (err: any) {
      console.log(err.message);
    }
  };

  const handleViderPanier = async () => {
    const token = localStorage.getItem("access");
    try {
      await axiosInstance.delete("/vider_un_panier/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPanier();
    } catch (err: any) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    fetchPanier();
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mb-4"></div>
          <p className="text-lg text-gray-600">Chargement du panier...</p>
        </div>
      </div>
    );
  }

  if (produits.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white rounded-3xl shadow-sm p-12">
          <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <GrShop size={32} className="text-gray-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Panier vide</h1>
          <p className="text-gray-500 mb-8 text-lg">
            Explorez nos collections et remplissez votre panier de produits exceptionnels
          </p>
          <button
            onClick={() => navigate("/Boutique")}
            className="bg-black text-white px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 w-full shadow-md"
          >
            Découvrir la boutique
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* En-tête */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Mon Panier</h1>
          <p className="text-gray-500 text-lg">{produits.length} article{produits.length > 1 ? 's' : ''}</p>
        </div>

        {/* Contenu principal */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Liste des produits */}
          <div className="flex-1 space-y-4">
            {produits.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  {/* Image du produit */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={`http://127.0.0.1:8004${prod.produit.image_principale}`}
                      alt={prod.produit.nom}
                      className="w-20 h-20 object-cover rounded-xl bg-gray-100"
                    />
                    <div className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {prod.quantite}
                    </div>
                  </div>

                  {/* Détails du produit */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1 truncate">
                      {prod.produit.nom}
                    </h3>
                    <p className="text-2xl font-bold text-black mb-4">
                      {prod.produit.prix_vente.toLocaleString()} GNF
                    </p>

                    {/* Contrôles de quantité */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-gray-200 rounded-lg bg-white">
                        <button
                          onClick={() => handleDiminuer(prod.id)}
                          className="p-2 hover:bg-gray-50 transition-colors rounded-l-lg"
                        >
                          <FaMinus className="text-gray-600 text-sm" />
                        </button>
                        <span className="px-4 py-2 font-semibold min-w-12 text-center text-gray-900">
                          {prod.quantite}
                        </span>
                        <button
                          onClick={() => handleQuantite(prod.id)}
                          className="p-2 hover:bg-gray-50 transition-colors rounded-r-lg"
                        >
                          <FaPlus className="text-gray-600 text-sm" />
                        </button>
                      </div>

                      <button
                        onClick={() => handleDelete(prod.id)}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors duration-200"
                      >
                        <FaTrash className="text-lg" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <button
                onClick={() => navigate("/Boutique")}
                className="flex-1 border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:border-black hover:bg-black hover:text-white transition-all duration-200"
              >
                Continuer mes achats
              </button>
              <button
                onClick={handleViderPanier}
                className="flex-1 border-2 border-red-500 text-red-500 px-6 py-3 rounded-xl font-semibold hover:bg-red-500 hover:text-white transition-all duration-200 flex items-center justify-center gap-2"
              >
                <FaTrash />
                Vider le panier
              </button>
            </div>
          </div>

          {/* Sidebar - Résumé et livraison */}
          <div className="lg:w-96 space-y-6">
            {/* Mode d'expédition */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-black p-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <FaTruck />
                  Mode d'expédition
                </h2>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FaCalendarAlt className="text-blue-600 text-lg" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Expédition standard</h3>
                    <p className="text-gray-600 text-sm">Livraison en 72h</p>
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="border border-gray-200 rounded-xl p-4 hover:border-green-400 transition-colors duration-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-green-100 p-2 rounded-lg">
                        <FaClock className="text-green-600" />
                      </div>
                      <span className="font-semibold text-gray-900">Express 24h</span>
                    </div>
                    <p className="text-sm text-gray-600">Livraison rapide sous 24h</p>
                  </div>

                  <div className="border border-gray-200 rounded-xl p-4 hover:border-yellow-400 transition-colors duration-200">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-yellow-100 p-2 rounded-lg">
                        <FaClock className="text-yellow-600" />
                      </div>
                      <span className="font-semibold text-gray-900">Horaires</span>
                    </div>
                    <p className="text-sm text-gray-600">Lun-Ven: 8h-18h</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Résumé de commande */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-semibold text-gray-900">
                    {total.toLocaleString()} GNF
                  </span>
                </div>
                
                <div className="flex justify-between items-center pb-4 border-b border-gray-200">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-semibold text-gray-900">Gratuite</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-black">
                    {total.toLocaleString()} GNF
                  </span>
                </div>
              </div>
              
              <button className="w-full bg-black text-white py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-all duration-200 mt-6 shadow-md">
                Procéder au paiement
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContenuPanier;