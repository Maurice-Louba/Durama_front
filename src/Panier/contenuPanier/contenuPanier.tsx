import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GrShop } from "react-icons/gr";
import { FaTrash, FaTruck, FaCalendarAlt, FaClock, FaPlus, FaMinus } from "react-icons/fa";
import axiosInstance from "../../utils/axiosInstance";
const ContenuPanier = () => {


interface Produit {
  id: number;
  nom: string;
  prix_vente: number; // ou string selon ton backend
  image_principale: string;
}

// Type pour un élément de panier
interface PanierItem {
  id: number;
  quantite: number;
  produit: Produit;
}
  const navigate = useNavigate();
const [produits, setProduits] = useState<PanierItem[]>([]);
const [total, setTotal] = useState<number>(0); // ou string si ton backend renvoie string
const [loading, setLoading] = useState<boolean>(true);


      const fetchData = async ()=>{
      const token = localStorage.getItem("access");
      try{
        const response = await axiosInstance.get("/prix_total/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        setTotal(response.data)
        console.log(response.data)
      }catch(err:any){
        console.log(err.message)
      }
    }
    



      const fetchPanier = async () => {
      const token = localStorage.getItem("access");
      try {
        const res = await fetch("https://durama-project.onrender.com/panier/items/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erreur de récupération du panier");
        const data = await res.json();
        setProduits(data || []);
      } catch (error) {
        console.error(error);
        setProduits([]);
      } finally {
        setLoading(false);
      }
    };

    const handlequantite  = async (id:any)=>{
    const token = localStorage.getItem("access");
    try{
          await axiosInstance.post(`/changer_quantiter/${id}/`,{},
        {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchPanier()
        fetchData()

    }catch(err:any){
        console.log(err.message)
    }
  }

   const handleDelete = async (id:any)=>{
    
        try{
          await axiosInstance.delete(`/supprimer_un_item/${id}/`);
        fetchPanier()
        fetchData()

    }catch(err:any){
        console.log(err.message)
    }
   }

   const handleduminier  = async (id:any)=>{
    const token = localStorage.getItem("access");
    try{
          await axiosInstance.post(`/diminuer_quantiter/${id}/`,{},
        {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchPanier()
        fetchData()

    }catch(err:any){
        console.log(err.message)
    }
  }

  const handleViderPanier= async ()=>{
    const token = localStorage.getItem("access")
    try{
        await axiosInstance.delete("/vider_un_panier/",
        {
          headers: { Authorization: `Bearer ${token}` },
        } 
        )
        fetchPanier()
        
    }catch(err:any){
        console.log(err.message)
    }
  }


  useEffect(() => {
    const fetchPanier = async () => {
      const token = localStorage.getItem("access");
      try {
        const res = await axiosInstance.get("/panier/items/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        ;
        setProduits(res.data);
      } catch (error) {
        console.error(error);
        setProduits([]);
      } finally {
        setLoading(false);
      }
    };
    fetchPanier();
  }, []);
      useEffect(()=>{
    const fetchData = async ()=>{
      const token = localStorage.getItem("access");
      try{
        const response = await axiosInstance.get("/prix_total/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        setTotal(response.data)
        console.log(response.data)
      }catch(err:any){
        console.log(err.message)
      }
    }
    fetchData()
  },[])

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

  // 🛒 Si le panier est vide
  if (produits.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md mx-auto text-center bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
          <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
            <GrShop size={40} className="text-gray-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Votre panier est vide</h1>
          <p className="text-gray-600 mb-8 leading-relaxed">
            Découvrez nos produits de qualité et commencez vos achats !
          </p>
          <button
            onClick={() => navigate("/Boutique")}
            className="bg-black text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg w-full"
          >
            Découvrir nos produits
          </button>
        </div>
      </div>
    );
  }

  // 🧾 Si le panier contient des produits
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Titre */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Mon Panier</h1>
          <div className="w-20 h-1 bg-black mx-auto"></div>
        </div>

        {/* Liste des produits */}
        <div className="space-y-4">
          {produits.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 overflow-hidden"
            >
              <div className="flex flex-col md:flex-row items-center p-6">
                <div className="flex items-center space-x-4 flex-1 mb-4 md:mb-0">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      className="w-5 h-5 border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-black text-black transition-colors" 
                    />
                  </div>
                  <div className="relative">
                    <img
                      src={`https://durama-project.onrender.com${prod.produit.image_principale}`}
                      alt={prod.produit.nom}
                      className="w-24 h-24 object-cover rounded-xl border border-gray-200 shadow-sm"
                    />
                    <div className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {prod.quantite}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-lg text-gray-800 mb-1">{prod.produit.nom}</h2>
                    {/*<p className="text-gray-600 text-sm mb-2">{prod.nom}</p>*/}
                    <p className="text-2xl font-bold text-black">
                      {prod.produit.prix_vente.toLocaleString()} GNF
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 rounded-lg bg-gray-50">
                    <button className="p-2 hover:bg-gray-200 transition-colors rounded-l-lg">
                      <FaMinus onClick={()=>handleduminier(prod.id)} className="text-gray-600" />
                    </button>
                    <span className="px-4 py-2 font-semibold min-w-12 text-center">{prod.quantite}</span>
                    <button className="p-2 hover:bg-gray-200 transition-colors rounded-r-lg">
                      <FaPlus onClick={()=>handlequantite(prod.id)} className="text-gray-600" />
                    </button>
                  </div>
                  <button onClick={()=>handleDelete(prod.id)} className="p-3 text-red-500 hover:bg-red-50 rounded-full transition-colors duration-200">
                    <FaTrash className="text-lg" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Boutons d'action */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-6 rounded-2xl shadow-md">
          <button
            onClick={() => navigate("/Boutique")}
            className="border-2 border-black text-black px-8 py-3 rounded-lg font-semibold hover:bg-black hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg"
          >
            Continuer mes achats
          </button>
          <button onClick={handleViderPanier} className="border-2 border-red-500 text-red-500 px-8 py-3 rounded-lg font-semibold hover:bg-red-500 hover:text-white transition-all duration-300 transform hover:-translate-y-1 shadow-md hover:shadow-lg flex items-center justify-center">
            <FaTrash className="mr-2" />
            Vider le panier
          </button>
        </div>

        {/* Mode d'expédition */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-black p-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <FaTruck className="text-white" />
              Mode d'expédition
            </h2>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FaCalendarAlt className="text-blue-600 text-lg" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-800">Expédition standard</h3>
                <p className="text-gray-600 text-sm">Livraison en 72h</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-xl p-4 hover:border-green-500 transition-colors duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <FaClock className="text-green-600" />
                  </div>
                  <span className="font-semibold text-gray-800">Express 24h</span>
                </div>
                <p className="text-sm text-gray-600">Livraison rapide sous 24h</p>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 hover:border-yellow-500 transition-colors duration-200">
                <div className="flex items-center gap-3 mb-2">
                  <div className="bg-yellow-100 p-2 rounded-lg">
                    <FaClock className="text-yellow-600" />
                  </div>
                  <span className="font-semibold text-gray-800">Horaires</span>
                </div>
                <p className="text-sm text-gray-600">Lun-Ven: 8h-18h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Résumé de commande */}
        <div className="bg-white rounded-2xl shadow-md p-6 sticky bottom-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600">Total ({produits.length} article{produits.length > 1 ? 's' : ''})</span>
            <span className="text-2xl font-bold text-black">
              {total} GNF
            </span>
          </div>
          <button className="w-full bg-black text-white py-4 rounded-lg font-bold text-lg hover:bg-gray-800 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-xl">
            Procéder au paiement
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContenuPanier;