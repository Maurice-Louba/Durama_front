import { MdShoppingCart } from "react-icons/md";
import casque from "./../../assets/Images/casquee.jpg"
import marteau from "./../../assets/Images/marteau.jpg"
interface Produit {
  nom: string;
  categorie: string;
  description: string;
  prix: string;
  image: string;
}

const produitsRecents: Produit[] = [
  {
    nom: "Casque de chantier",
    categorie: "Sécurité",
    description: "Casque résistant aux chocs pour protection optimale.",
    prix: "49,99 €",
    image: marteau,
  },
  {
    nom: "Pistolet à peinture",
    categorie: "Second-œuvre",
    description: "Pistolet haute précision pour vos travaux de finition.",
    prix: "129,99 €",
    image: casque,
  },
  {
    nom: "Marteau professionnel",
    categorie: "Outillage",
    description: "Marteau durable pour tous types de travaux.",
    prix: "24,99 €",
    image: "/images/produits/marteau.jpg",
  },
  {
    nom: "Gilet de sécurité",
    categorie: "Sécurité",
    description: "Gilet haute visibilité pour vos chantiers.",
    prix: "19,99 €",
    image: "/images/produits/gilet.jpg",
  },
];

const ProduitsRecents = () => {
  return (
    <div className="bg-white py-20">
      <div className=" max-w-[1400px] mx-auto px-4  ">
        {/* En-tête */}
        <div className="text-center mb-16">
          <p className="text-sm font-semibold tracking-wider text-gray-600">NOUVEAUTÉS</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
            NOS PRODUITS RÉCEMMENT AJOUTÉS
          </h2>
          <p className="text-gray-600 mt-4">
            Découvrez les derniers ajouts à notre catalogue BTP.
          </p>
        </div>

        {/* Grille des produits responsive */}
        <div className="grid  grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {produitsRecents.map((prod, index) => (
            <div
              key={index}
              className="bg-white shadow-md border border-[#b5e955] rounded-lg overflow-hidden hover:shadow-xl transition"
            >
              <img
                src={prod.image}
                alt={prod.nom}
                className="w-full h-42 sm:h-52 object-cover"
              />
              <div className="p-4 sm:p-6 flex flex-col gap-0">
                <p className="text-sm text-gray-500">{prod.categorie}</p>
                <h3 className="sm:text-lg text-sm font-extrabold text-gray-900">{prod.nom}</h3>
                <p className="text-gray-600 hidden sm:block text-sm">{prod.description}</p>
                <p className="font-bold text-gray-900 mt-1">{prod.prix}</p>

                <div className="flex gap-2 mt-1">
                  <button className="flex-1 px-3 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800 transition flex items-center justify-center gap-1">
                    Ajouter <MdShoppingCart />
                  </button>
                  <button className="flex-1 px-3 py-2 border rounded-md text-sm hover:bg-gray-100 transition">
                    Voir
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

export default ProduitsRecents;
