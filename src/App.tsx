
import './App.css'
import ToutHomePage from './HomePage/toutHomePage'
import AOS from 'aos';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import 'aos/dist/aos.css';
import { useEffect } from 'react';
import ToutBoutique from './Boutique/ToutBoutique';
import ToutPanier from './Panier/ToutPanier';
import ToutFavori from './Favori/ToutFavori';
import Toutprofil from './profil/Toutprofil';
import Toutmonprofil from './Monprofil/Toutmonprofil';
import SignUpForm from './profil/faireprofil/FaireProfil';
import VerifyEmail from './profil/verifierOtp/verifierOtp';

function App() {
      useEffect(() => {
    AOS.init({
      duration: 800,
      once: false, 
    });

    
    AOS.refresh();
  }, []);


  return (
    <Router>
      <Routes>
        <Route path='/' element={<ToutHomePage/>}/>
        <Route path='/Boutique' element={<ToutBoutique/>}/>
        <Route path='/Panier' element={<ToutPanier/>}/>
        <Route path='/Favori' element={<ToutFavori/>}/>
        <Route path='/Profil' element={<Toutprofil/>}/>
        <Route path='/MonProfil' element={<Toutmonprofil/>}/>
        <Route path='/SignUp' element={<SignUpForm/>}/>
        <Route path="/VerifierOtp" element={<VerifyEmail/>}/>
      </Routes>
    </Router>
  )
}

export default App
