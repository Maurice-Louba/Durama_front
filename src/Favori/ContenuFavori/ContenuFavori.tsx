
import { FaHeart } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
const ContenuFavori = () => {
    const navigate= useNavigate()
  return (
    <div className="bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mt-2">
                <h1 className="text-2xl font-semibold">Mes Favoris</h1>
            </div>
            <div className="mt-4">
                <p className="text-gray-500 "> 0 produit dans vos favoris</p>
            </div>
            <div className="items-center justify-center flex-col flex py-40">
                <FaHeart className="text-gray-400" size={90} />
                <h1 className="text-2xl mt-2 font-semibold">Votre liste de favoris est vide </h1>
                <p className="text-gray-500 mt-4">Decouvrez notre gamme de produit Btp et ajoutez  <span className="items-center justify-center flex">les à vos favoris</span></p>
                
                    <button onClick={()=>navigate("/Boutique")} className="flex-1 w-[200px] px-2 py-2 bg-black text-white rounded-md text-sm  hover:bg-gray-800 transition flex items-center justify-center mt-4">
                        <p className="text-xl  px-1 py-1 font-semibold">Nos Produits</p>
                    </button>

            </div>

        </div>
      
    </div>
  )
}

export default ContenuFavori
