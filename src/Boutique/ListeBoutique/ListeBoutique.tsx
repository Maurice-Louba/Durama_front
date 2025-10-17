import { MdShoppingCart } from "react-icons/md";

interface Produit {
  nom: string;
  categorie: string;
  description: string;
  prix: string;
  image: string;
}


const produits: Produit[] = Array.from({ length: 20 }).map((_, i) => ({
  nom: `Produit BTP ${i + 1}`,
  categorie: ["Gros-Œuvre", "Second-Œuvre", "Outillage", "Sécurité"][i % 4],
  description: "Description courte et efficace pour ce produit BTP.",
  prix: `${(10 + i * 5).toFixed(2)} FGN`,
  image: `/images/produits/produit${(i % 8) + 1}.jpg`, 
}));

const Boutique = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
            Notre Boutique BTP
          </h1>
          <p className="mt-4 text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Découvrez notre large sélection de produits pour tous vos besoins en construction et bricolage.
          </p>
        </div>

        {/* Grille des produits */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-6">
          {produits.map((prod, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-lg mt-1 overflow-hidden hover:shadow-xl transition w-full"
            >
              <img
                src={prod.image}
                alt={prod.nom}
                className="w-full  h-40 sm:h-48 object-cover"
              />
              <div className="p-2 flex flex-col gap-1">
                <p className="text-sm text-gray-500">{prod.categorie}</p>
                <h3 className="text-lg font-extrabold text-gray-900">{prod.nom}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{prod.description}</p>
                <p className="font-bold text-gray-900 mt-1">{prod.prix}</p>

                <div className="flex gap-2 mt-0">
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

export default Boutique;
