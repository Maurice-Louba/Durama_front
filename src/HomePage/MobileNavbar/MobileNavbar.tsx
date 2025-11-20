import { FaHome, FaHeart, FaUser, FaShoppingCart,FaUserCircle } from "react-icons/fa";
import { AiFillShop } from "react-icons/ai";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import axiosInstance from "../../utils/axiosInstance";
const MobileNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {isAuthenticated}=useAuth()
    const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    bio: "",
    date_joined: "",
    commandes: 0,
    favoris: 0,
    photo: "",
  });



  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      
      return;
    }

    axiosInstance.get("/infoUser/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        const data = response.data;
        setUser({
          first_name: data.first_name || "",
          last_name: data.last_name || "",
          email: data.email,
          phone_number: data.phone_number || "Non renseigné",
          address: data.address || "Non renseignée",
          bio: data.bio || "Aucune bio pour le moment",
          date_joined: new Date(data.date_joined).toLocaleDateString(),
          commandes: data.commandes_count || 4,
          favoris: data.favoris_count || 1,
          photo:
            data.photo,
        });
        console.log(user)
      })
      .catch((error) => {
        console.error("Erreur lors du chargement du profil :", error);
        
      });
  }, []);






  // Déterminer quelle route est active
  const currentPath = location.pathname;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 shadow-lg z-50 sm:hidden">
      <div className="flex justify-around items-center py-2">
        
        <div onClick={() => navigate("/")} className="flex flex-col items-center">
          <FaHome className={`${currentPath === "/" ? "text-black" : "text-gray-500"} text-xl mb-1`} />
          <span className={`text-[12px] font-semibold ${currentPath === "/" ? "text-black" : "text-gray-500"}`}>
            Accueil
          </span>
        </div>

        <div onClick={() => navigate("/Boutique")} className="flex flex-col items-center">
          <AiFillShop className={`${currentPath === "/Boutique" ? "text-black" : "text-gray-500"} text-xl mb-1`} />
          <span className={`text-[12px] font-semibold ${currentPath === "/Boutique" ? "text-black" : "text-gray-500"}`}>
            Boutique
          </span>
        </div>

        <div onClick={()=>navigate("/Panier")} className="flex flex-col items-center text-gray-500 hover:text-[#00838F] transition">
          <FaShoppingCart className={`text-xl ${currentPath=="/Panier"?"text-black":"text-gray-500"} mb-1`} />
          <span className={`text-[12px] ${currentPath=="/Panier"?"text-black":"text-gray-500"} font-semibold`}>Panier</span>
        </div>

        <div onClick={()=>navigate("/Favori")} className="flex flex-col items-center text-gray-500 hover:text-[#00838F] transition">
          <FaHeart className={`text-xl ${currentPath==="/Favori"?"text-black":"text-gray-500"} mb-1`} />
          <span className={`text-[12px] ${currentPath==="/Favori"?"text-black":"text-gray-500"} font-semibold`}>Favoris</span>
        </div>

        <div  className="flex flex-col items-center text-gray-500 hover:text-[#00838F] transition">
          <Link to={isAuthenticated ? "/MonProfil":"/Profil"}>
          {
            isAuthenticated ?(
              user.photo==null ?
              (<FaUserCircle className={`text-xl ${currentPath=="/MonProfil"?"text-black":"text-gray-500"} ml-1  mb-1`} />):
              <div className="w-[25px] h-[25px] rounded-full border border-gray-500">
              <img className="w-full h-full rounded-full" src={`http://127.0.0.1:8004${user.photo}`}/>
              </div>
            ):(
              <FaUser className={`text-xl ${currentPath=="/Profil"?"text-black":"text-gray-500"} ml-1  mb-1`} />
            )
          }
          
          <span className={`text-[12px] ${currentPath=="/Profil"?"text-black":"text-gray-500"}  font-semibold`}>Profil</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;
