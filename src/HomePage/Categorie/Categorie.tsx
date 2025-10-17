import { MdChevronRight } from "react-icons/md";
import { FaHardHat, FaToolbox, FaPaintRoller, FaShieldAlt } from "react-icons/fa";

interface CategorieItem {
  titre: string;
  sousTitre: string;
  description: string;
  icon: React.ReactNode;
  position: "left" | "right";
}

const categories: CategorieItem[] = [
  {
    titre: "GROS-ŒUVRE",
    sousTitre: "Fondations et structures",
    description: "Matériaux essentiels pour la construction de base.",
    icon: <FaHardHat size={28} className="text-orange-600" />,
    position: "right",
  },
  {
    titre: "SECOND-ŒUVRE",
    sousTitre: "Finitions et aménagements",
    description: "Produits pour la décoration et les finitions intérieures.",
    icon: <FaPaintRoller size={28} className="text-blue-600" />,
    position: "left",
  },
  {
    titre: "OUTILLAGE",
    sousTitre: "Équipements professionnels",
    description: "Outils de haute qualité pour tous les métiers.",
    icon: <FaToolbox size={28} className="text-green-600" />,
    position: "right",
  },
  {
    titre: "SÉCURITÉ",
    sousTitre: "Équipements de protection",
    description: "Protégez vos équipes avec nos équipements de sécurité.",
    icon: <FaShieldAlt size={28} className="text-red-600" />,
    position: "left",
  },
];

const Categorie = () => {
  return (
    <div className="bg-gray-50 mt-7 py-20 overflow-x-hidden">
      <div className="max-w-6xl mx-auto px-6 relative">
        {/* En-tête */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold tracking-wider text-gray-600">CATÉGORIES</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
            NOS PRINCIPALES CATÉGORIES DE PRODUITS
          </h2>
          <p className="text-gray-600 mt-4">
            Découvrez notre gamme complète de matériaux et d’équipements pour la construction.
          </p>

          <div className="flex justify-center gap-4 mt-6">
            <button className="px-5 py-2 bg-black text-white text-sm font-semibold rounded-md hover:bg-gray-800 transition">
              Explorer
            </button>
            <button className="flex items-center gap-1 px-5 py-2 border text-sm font-semibold rounded-md hover:bg-gray-100 transition">
              En savoir plus <MdChevronRight />
            </button>
          </div>
        </div>

        {/* Ligne verticale centrale */}
        <div className="absolute  mt-85  left-1/2 top-0 bottom-0 w-[2px] bg-gray-300 transform -translate-x-1/2" />

        {/* Timeline */}
        <div className="space-y-16">
          {categories.map((cat, index) => (
            <div
              key={index}
              className={`flex items-center ${
                cat.position === "left"
                  ? "justify-start text-right"
                  : "justify-end text-left"
              } relative`}
            >
              {/* Point central */}
              <div className=" hidden md:block absolute left-1/2 w-4 h-4 bg-black rounded-full transform -translate-x-1/2 z-10" />

              {/* Carte */}
              <div
                className={`bg-white shadow-md rounded-lg p-6 w-[90%] sm:w-[400px] ${
                  cat.position === "left" ? "ml-0 mr-auto" : "ml-auto mr-0"
                }`}
                data-aos={cat.position === "left" ? "fade-right" : "fade-left"}
              >
                <div className="flex items-center gap-2 mb-2 justify-center sm:justify-start">
                  {cat.icon}
                  <h3 className="text-xl font-extrabold">{cat.titre}</h3>
                </div>
                <p className="font-semibold text-gray-700">{cat.sousTitre}</p>
                <p className="text-gray-600 mt-1">{cat.description}</p>

                <div className="flex gap-3 mt-4 justify-center sm:justify-start">
                  <button className="px-4 py-1 bg-black text-white rounded-md text-sm hover:bg-gray-800 transition">
                    Voir
                  </button>
                  <button className="flex items-center text-sm font-semibold text-gray-800 hover:text-black transition">
                    Détails <MdChevronRight />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categorie;
