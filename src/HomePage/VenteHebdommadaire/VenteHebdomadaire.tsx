import { FaTag } from "react-icons/fa";
import marteau from "./../../assets/Images/marteau.jpg";

const VenteHebdomadaire = () => {
  const venteHebo = [
    {
      nom: "Casque de chantier",
      categorie: "Sécurité",
      description: "Casque résistant aux chocs pour protection optimale.",
      prix: "49,99 €",
      image: marteau,
    },
    {
      nom: "Casque de chantier",
      categorie: "Sécurité",
      description: "Casque résistant aux chocs pour protection optimale.",
      prix: "49,99 €",
      image: marteau,
    },
    {
      nom: "Casque de chantier",
      categorie: "Sécurité",
      description: "Casque résistant aux chocs pour protection optimale.",
      prix: "49,99 €",
      image: marteau,
    },
    {
      nom: "Casque de chantier",
      categorie: "Sécurité",
      description: "Casque résistant aux chocs pour protection optimale.",
      prix: "49,99 €",
      image: marteau,
    },
  ];

  return (
    <div className="bg-[#F5F5F5] py-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre */}
        <div className="flex  justify-start">
          <FaTag className="text-black mt-2" size={20}/>
          <p className="text-xl ml-3 font-bold text-gray-900">
            Ventes Hebdomadaires
          </p>
        </div>

        {/* Produits */}
        <div
          className="
            mt-8 
            grid 
            gap-6 
            grid-cols-1 
            sm:grid-cols-2 
            lg:grid-cols-3 
            xl:grid-cols-4
          "
        >
          {venteHebo.map((prod, index) => (
            <div
              key={index}
              className="bg-white flex items-center gap-4 rounded-xl p-4 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              {/* Image */}
              <div className="w-[70px] h-[70px] flex-shrink-0">
                <img
                  src={prod.image}
                  alt={prod.nom}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              {/* Infos */}
              <div className="flex flex-col">
                <p className="text-base font-bold text-gray-900">{prod.nom}</p>
                <p className="text-sm text-gray-500">{prod.categorie}</p>
                <p className="text-sm text-gray-400">{prod.prix}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VenteHebdomadaire;
