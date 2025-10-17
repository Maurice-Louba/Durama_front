import Footer from "../HomePage/Footer/Footer"
import MobileNavbar from "../HomePage/MobileNavbar/MobileNavbar"
import Navbar from "../HomePage/Navbar/Navbar"
import ContenuPanier from "./contenuPanier/contenuPanier"


const ToutPanier = () => {
  return (
    <div>
        <Navbar/>
        <MobileNavbar/>
        <ContenuPanier/>
        
        <Footer/>
      
    </div>
  )
}

export default ToutPanier
