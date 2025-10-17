import Footer from "../HomePage/Footer/Footer"
import MobileNavbar from "../HomePage/MobileNavbar/MobileNavbar"
import Navbar from "../HomePage/Navbar/Navbar"
import Boutique from "./ListeBoutique/ListeBoutique"


const ToutBoutique = () => {
  return (
    <div>
        <MobileNavbar/>
        <Navbar/>
        <Boutique/>
        <Footer/>
    </div>
  )
}

export default ToutBoutique
