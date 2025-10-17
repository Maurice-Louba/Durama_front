import stock1 from "./../../assets/Images/stock2.jpg";
import chantier from "./../../assets/Images/cheung-gnaiq-qX-ww-RimQc-unsplash.jpg";
import chantier1 from "./../../assets/Images/kyle-loftus-bq4jHJo59Lo-unsplash.jpg";
import { MdChevronRight } from "react-icons/md";
import { FaCube } from "react-icons/fa6";

const Avantages = () => {
  return (
    <div className="bg-white shadow-sm mt-20 overflow-y-hidden mb-20 overflow-x-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre principal */}
        <div className="text-center">
          <p className="text-sm font-bold text-gray-700">NOS AVANTAGES</p>
          <p className="text-3xl font-extrabold text-black mt-2">
            POURQUOI CHOISIR DURAMA
          </p>
          <p className="text-xl text-gray-700 mt-2">
            Un service professionnel conçu pour les experts du bâtiment
          </p>
        </div>

        {/* Section images */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16 place-items-center">
          {/* --- Carte 1 --- */}
          <div data-aos="fade-up" className="relative w-full max-w-[450px] h-[250px] overflow-hidden shadow-md">
            <img
              className="w-full h-full object-cover opacity-90"
              src={stock1}
              alt="Stock"
            />
            <div className="absolute inset-0  bg-opacity-40"></div>

            <div className="absolute inset-0 mt-6 ml-3 px-4">
              <h1 className="text-lg font-bold text-white">Stock</h1>
              <p className="text-[22px] sm:text-[26px] font-bold mt-2 text-white">
                15 000 RÉFÉRENCES EN STOCK
              </p>
              <p className="mt-2 text-sm sm:text-base text-white">
                Large gamme de produits immédiatement disponibles<br />
                pour vos chantiers
              </p>

              <div className="flex flex-wrap gap-3 mt-3">
                <div className="w-[120px] h-[40px] flex items-center justify-center bg-white/10 backdrop-blur-md rounded-md cursor-pointer hover:bg-white/20 transition">
                  <p className="text-white text-sm">Découvrir</p>
                </div>

                <div className="flex items-center gap-1 cursor-pointer hover:translate-x-1 transition">
                  <p className="text-white text-sm">En savoir plus</p>
                  <MdChevronRight className="text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* --- Carte 2 --- */}
          <div  className="relative w-full max-w-[450px] h-[250px] overflow-hidden  shadow-md">
            <img
              className="w-full h-full object-cover opacity-90"
              src={chantier}
              alt="Chantier"
            />
            <div className="absolute inset-0  bg-opacity-40"></div>

            <div className="absolute inset-0 mt-6 ml-3 px-4">
              <FaCube size={28} className="text-white" />
              <p className="text-[22px] sm:text-[26px] font-bold mt-2 text-white">
                PRIX NÉGOCIÉ
              </p>
              <p className="mt-2 text-sm sm:text-base text-white">
                Tarifs compétitifs pour professionnels<br />
                pour vos chantiers
              </p>

              <div className="flex items-center gap-1 mt-3 cursor-pointer hover:translate-x-1 transition">
                <p className="text-white text-sm">Détails</p>
                <MdChevronRight className="text-white" />
              </div>
            </div>
          </div>

          {/* --- Carte 3 --- */}
          <div data-aos="fade-down" className="relative w-full max-w-[450px] h-[250px] overflow-hidden  shadow-md">
            <img
              className="w-full h-full object-cover opacity-90"
              src={chantier1}
              alt="Service après-vente"
            />
            <div className="absolute inset-0  bg-opacity-40"></div>

            <div className="absolute inset-0 mt-6 ml-3 px-4">
              <FaCube size={28} className="text-white" />
              <p className="text-[22px] sm:text-[26px] font-bold mt-2 text-white">
                SERVICE APRÈS-VENTE
              </p>
              <p className="mt-2 text-sm sm:text-base text-white">
                Support technique 7 jours sur 7
              </p>

              <div className="flex items-center gap-1 mt-3 cursor-pointer hover:translate-x-1 transition">
                <p className="text-white text-sm">Détails</p>
                <MdChevronRight className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Avantages;
