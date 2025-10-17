import Avantages from "./Avantages/Avantages"
import Categorie from "./Categorie/Categorie"
import Footer from "./Footer/Footer"
import GrosOeuvres from "./GrosOeuvres/GrosOeuvres"
import ImageDefilantes from "./imageDefilantes/ImageDefilantes"
import LivraisonGratuit from "./LivraisonGratuit/LivraisonGratuit"
import LivraisonRapide from "./LivraisonRapide/LivraisonRapide"
import MobileNavbar from "./MobileNavbar/MobileNavbar"
import Navbar from "./Navbar/Navbar"
import Outillage from "./Outillage/Outillage"
import ProduitsRecents from "./ProduitRecents/ProduitRecents"
import Qualite from "./qualite/Qualite"
import VenteHebdomadaire from "./VenteHebdommadaire/VenteHebdomadaire"


const ToutHomePage = () => {
  return (
    <div className="overflow-x-hidden">
        
        <Navbar/>
        <ImageDefilantes/>
        <Avantages/>
        <Categorie/>
        <ProduitsRecents/>
        <LivraisonGratuit/>
        <GrosOeuvres/>
        <Qualite/>
        <Outillage/>
        <LivraisonRapide/>
        <VenteHebdomadaire/>
        <Footer/>
        <MobileNavbar/>
      
    </div>
  )
}

export default ToutHomePage
