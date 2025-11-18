import Footer from "../HomePage/Footer/Footer"
import MobileNavbar from "../HomePage/MobileNavbar/MobileNavbar"
import Navbar from "../HomePage/Navbar/Navbar"
import ProduitParCategorie from "./ContenuParGrosC/ContenuParGrosCategorie"


const ToutPCategorie = () => {
  return (
    <div>
        <MobileNavbar/>
        <Navbar/>
        <ProduitParCategorie/>
        <Footer/>
      
    </div>
  )
}

export default ToutPCategorie
