import { useNavigate } from "react-router-dom";
import { GrShop } from "react-icons/gr";
const ContenuPanier = () => {
    const navigate = useNavigate()
  return (
    <div className="bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 ">
            <div>
                <div>
                    <h1 className="text-3xl font-semibold">Panier</h1>
                </div>
                <div className="h-full flex flex-col py-50 w-full items-center justify-center">
                    <GrShop size={90}  className="text-gray-400"/>
                    <h1 className="mt-4 text-2xl font-semibold">Votre panier est vide </h1>
                    <p className="text-gray-500 mt-4">Découvrez nos produits de qualités et commencez <span className="items-center justify-center flex">vos achats !</span></p>
                    <button onClick={()=>navigate("/Boutique")} className="flex-1 w-[200px] px-2 py-2 bg-black text-white rounded-md text-sm  hover:bg-gray-800 transition flex items-center justify-center mt-4">
                        <p className="text-xl  px-1 py-1 font-semibold">Commencez</p>
                    </button>
                    
                </div>


            </div>
        </div>
      
    </div>
  )
}

export default ContenuPanier
