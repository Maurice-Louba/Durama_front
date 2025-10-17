const LivraisonGratuit = () => {
  return (
    <div data-aos="fade-right" className="bg-[#F5F5F5] rounded-xl overflow-hidden py-10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        
        <p className="text-sm sm:text-base font-bold text-black tracking-wider">
          OFFRE
        </p>

       
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-black mt-4 leading-snug">
          LIVRAISON GRATUITE DÈS <span className="text-orange-600">2500 FG HT</span>
        </h2>

        
        <p className="mt-4 text-gray-800 text-sm sm:text-base max-w-2xl mx-auto">
          Profitez de notre offre exceptionnelle de livraison gratuite pour vos commandes
          <br className="hidden sm:block" />
          professionnelles et bénéficiez d’un service rapide et sécurisé.
        </p>

        {/* Bouton d'action */}
        <div className="mt-6 flex justify-center">
          <button className="px-6 py-2 bg-black text-white text-sm sm:text-base font-semibold rounded-md hover:bg-gray-800 transition">
            En profiter maintenant
          </button>
        </div>
      </div>
    </div>
  );
};

export default LivraisonGratuit;
