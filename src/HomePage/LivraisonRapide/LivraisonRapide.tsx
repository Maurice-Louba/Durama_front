
import camion from "./../../assets/Images/voiture (1).jpg"
const LivraisonRapide = () => {
  return (
    <div data-aos="fade-right" className="bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="items-center mt-4 justify-center flex">
                <p className="text-[10px] font-bold">LIVRAISON</p>

            </div>
            <div className="items-center mt-4 justify-center flex">
                <p className="text-2xl font-bold">LIVRAISON RAPIDE ET <span className="text-orange-600">SECURISE</span></p>

            </div>
            <div className="w-full">
                <img className="w-full" src={camion}/>
            </div>

        </div>
      
    </div>
  )
}

export default LivraisonRapide
