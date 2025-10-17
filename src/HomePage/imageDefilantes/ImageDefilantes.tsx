import { useState, useEffect } from 'react';
import image from "./../../assets/Images/ouvrier.jpg"
import brique from "./../../assets/Images/mur-de-briques (1).jpg"
const images = [
  {
    src: 'https://cdn.pixabay.com/photo/2020/09/09/00/20/man-5556152_1280.jpg',
    alt: 'Chantier en construction',
    title: <>FAITES VIVRE VOS<br/> CHANTIERS AVEC DURAMA</>,
    description: <>Votre partenaire de confiance pour tous vos projets de construction. Des<br/> matériaux de haute qualité livrés rapidement.</>,
  },
  {
    src: image,
    alt: 'Équipe sur le chantier',
    title: <>UNE ÉQUIPE DÉDIÉE À <br/> VOTRE PROJET</>,
    description: 'Des professionnels expérimentés pour assurer la réussite de vos travaux.',
  },
  {
    src: brique,
    alt: 'Matériaux de construction',
    title: <>MATÉRIAUX DE QUALITÉ <br/> SUPÉRIEURE</>,
    description: 'Des produits fiables pour garantir la durabilité de vos constructions.',
  },
];

const ImageDefilantes = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Changer d'image toutes les 3 secondes

    return () => clearInterval(interval); // Nettoyage de l'intervalle au démontage
  }, []);

  const { src, alt, title, description } = images[currentIndex];

  return (
    <div className="relative w-screen h-[600px] overflow-hidden overflow-x-hidden">
      {/* Image avec overlay */}
      <img
        src={src}
        alt={alt}
        className="w-full h-full opacity-100 object-cover"
      />
      {/* Overlay semi-transparent */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Texte centré */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-white px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold">{title}</h1>
        <p className="mt-4 text-lg md:text-2xl">{description}</p>
        <div className="flex mt-4 gap-4">
          <div className="w-[150px] cursor-pointer hover:bg-[#aaa7a7] hover:scale-x-100 transition h-[40px] px-2 py-2 bg-white">
            <p className="text-black">Devis express</p>
          </div>
          <div className="w-[120px] cursor-pointer  transition  h-[40px] px-2 py-2 bg-white/15 backdrop-blur-md">
            <p className="text-white">Catalogue</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageDefilantes;
