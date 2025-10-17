import { useState } from "react";
import { FaAngleDown, FaBars, FaXmark } from "react-icons/fa6";
import { FaTools } from "react-icons/fa";
import { GiBrickWall } from "react-icons/gi";
import { FaAngleUp } from "react-icons/fa6";
import { FaHardHat } from "react-icons/fa"
import { MdChevronRight } from "react-icons/md";
import { CiShoppingCart } from "react-icons/ci";
import { FaPaintRoller } from "react-icons/fa";
import { FaPenNib } from "react-icons/fa";
import { FaBookOpen } from "react-icons/fa";
import { FaGraduationCap } from "react-icons/fa";
import { RiSearch2Line } from "react-icons/ri";
import { FaHandshake } from "react-icons/fa";
import fer from "./../../assets/Images/iron-rods-474792_1280.jpg"
import marteau from "./../../assets/Images/welded-wire-mesh-3630567_1280.jpg"

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [extension,setextension]=useState(false)
  const [panierextension,setpanierextension]=useState(false)

  const handlepanierextension= ()=>{
    setpanierextension(!panierextension)
  }
  const mettrepanierextension=()=>{
    setpanierextension(false)
  }
  const toggleMenu = () => setMenuOpen(!menuOpen);
  const handleextensionTrue= ()=> {
    setextension(true)
  }
const handleextensionfalse= ()=> {
    setextension(false)
  }

const handleextension=()=>{
    setextension(!extension)
}

  return (
    <nav className="bg-[#F5F5F5] shadow-sm py-6 ">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* --- Logo --- */}
          <div className="flex items-center justify-center gap-6">
          <div className="flex-shrink-0 text-2xl font-bold ">
            Logo
          </div>

          {/* --- Menu Desktop --- */}
          <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
            <a href="/" className="hover:text-[#FF5C02] transition-colors">
              Accueil
            </a>
            <div onClick={handleextension} onMouseEnter={handleextensionTrue}  className="flex items-center hover:text-[#FF5C02] cursor-pointer transition-colors">
              <span>Catégories</span>
              {extension==false?<FaAngleDown className="ml-1" />:<FaAngleUp className="ml-1" />}
            </div>
            <a href="/Boutique" className="hover:text-[#FF5C02] transition-colors">
              Boutique
            </a>
            <a href="#" className="hover:text-[#FF5C02] transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-[#FF5C02] transition-colors">
              A propos
            </a>
          </div>
          </div>

          {/* --- Boutons de droite --- */}
          <div className="hidden md:flex items-center gap-4">
            <RiSearch2Line size={24} className="text-black" />
            <CiShoppingCart  onMouseEnter={handlepanierextension} size={24} className="text-black" />
            <button className="px-5 py-2  border border-gray-400 text-black hover:bg-gray-100 transition-colors">
              Connexion
            </button>
            <button className="px-5 py-2  bg-[#FF5C02] text-white hover:bg-[#e35400] transition-colors">
              Inscription
            </button>
          </div>


          {/* --- Menu mobile (icône) --- */}
          <div className="md:hidden flex items-center">
            <button onClick={toggleMenu} className="text-2xl text-black">
              {menuOpen ? <FaXmark /> : <FaBars />}
            </button>
          </div>
        </div>
        <div  onMouseLeave={mettrepanierextension} className={`${panierextension==true?"block":"hidden"} w-[300px] mb-4 h-[150px] flex-none mx-[1050px] justify-end items-end`}>
            <div className="h-[90px] w-full items-center justify-center flex">
              <p className="text-gray-400">votre panier est vide </p>
            </div>
            <div className="w-full bg-gray-600 h-[2px]"/>
            <div className="flex justify-between">
              <p className=" text-xl text-gray-400">Total</p>
              <p className=" text-xl text-gray-400">0 FGN</p>

            </div>
            <div className="px-4 py-4 items-center gap-4 justify-center flex">
            <button className="px-5 py-2 w-[200px] border border-gray-400 text-black hover:bg-gray-100 transition-colors">
              Voir panier
            </button>
            <button className="px-5 py-2  w-[200px] bg-[#FF5C02] text-white hover:bg-[#e35400] transition-colors">
              Commander
            </button>

            </div>

          </div>
        
        <div onMouseEnter={handleextensionTrue} onMouseLeave={handleextensionfalse} className={`${extension==true?"block":"hidden"} grid mt-6  grid-cols-3 gap-4`}>
            <div className=" py-6">
            
            <div>
                <p className="font-bold text-gray-700 ">Nos Catégories</p>
            </div>
            <div className="mt-8">
            <div className="flex mt-4 items-center gap-2 justify-start">
                <GiBrickWall size={20} className="font-semibold text-black" />
                <p className="text-black font-bold">Gros-oeuvres</p>
                
            </div>
            <p className="text-gray-500 font-medium ml-6">Une petite description...</p>
            </div>
            <div className="mt-8">
            <div className="flex mt-4 items-center gap-2 justify-start">
                <FaPaintRoller size={20} className="font-semibold text-black" />
                <p className="text-black font-bold">Second-oeuvres</p>
                
            </div>
                <p className="text-gray-500 font-medium ml-6">Une petite description...</p>
            </div>
            <div className="mt-8">
            <div className="flex mt-4 items-center gap-2 justify-start">
                <FaTools className="font-semibold text-black" />
                <p className="text-black font-bold">Outillage</p>
                
            </div>
                <p className="text-gray-500 font-medium ml-6">Une petite description...</p>
            </div>

            <div className="mt-8 mb-10">
            <div className="flex mt-4 items-center gap-2 justify-start">
               <FaHardHat size={20} className="font-semibold text-black" />
                <p className="text-black font-bold">Sécurité</p>
                
            </div>
                <p className="text-gray-500 font-medium ml-6">Une petite description...</p>
            </div>




            </div>
            <div className=" py-6">
                <div>
                <p className="font-bold text-gray-700 ">Actualités</p>
            </div>
            <div className="mt-8">
            <div className="flex mt-4 items-center gap-2 justify-start">
                <FaPenNib size={20} className="font-semibold text-black" />
                <p className="text-black font-bold">Blog</p>
                
            </div>
            <p className="text-gray-500 font-medium ml-6">Une petite description...</p>
            </div>
            <div className="mt-8">
            <div className="flex mt-4 items-center gap-2 justify-start">
                <FaBookOpen size={20} className="font-semibold text-black" />
                <p className="text-black font-bold">Guides</p>
                
            </div>
                <p className="text-gray-500 font-medium ml-6">Une petite description...</p>
            </div>
            <div className="mt-8">
            <div className="flex mt-4 items-center gap-2 justify-start">
                <FaGraduationCap size={20} className="font-semibold text-black" />
                <p className="text-black font-bold">Formation</p>
                
            </div>
                <p className="text-gray-500 font-medium ml-6">Une petite description...</p>
            </div>

            <div className="mt-8 mb-10">
            <div className="flex mt-4 items-center gap-2 justify-start">
                <FaHandshake size={20} className=" text-black" />
                <p className="text-black font-bold">Partenaires</p>
                
            </div>
                <p className="text-gray-500 font-medium ml-6">Une petite description...</p>
            </div>
 

            </div>
            <div className="bg-white w-[530px] px-6 py-6">
                <div className="">
                    <p className="text-gray-700 font-bold">Dernier articles</p>

                </div>
                <div className="flex mt-4  w-full items-center justify-center">
                    <div className="w-[500px]  " >
                        <img className="W-full h-[130px]" src={fer}/>
                    </div>
                    <div className=" -ml-20 py-4">
                        <p className="font-bold text-gray-700 -mt-10">Titre du produit</p> 
                        <p className="mt-2 text-gray-500 font-semibold">Lorem ipsum dolor, sit amet  juste un text un petit  </p>
                        <a href="#" className="mt-4 underline">Lire plus</a>
                    </div>
                    <div>
                        
                    </div>

                </div>


                <div className="flex mt-4  w-full items-center justify-center">
                    <div className="w-[500px]  " >
                        <img className="W-full h-[130px]" src={marteau}/>
                    </div>
                    <div className=" -ml-20 py-4 mt-4">
                        <p className="font-bold text-gray-700 -mt-10">Titre du produit</p> 
                        <p className="mt-2 text-gray-500 font-semibold">Lorem ipsum dolor, sit amet  juste un text un petit  </p>
                        <a href="#" className="mt-4 underline">Lire plus</a>
                    </div>
                    <div>
                        
                    </div>

                </div>
                <div className="flex mt-4">
                    <a className="text-gray-700 ">Voir plus d'articles</a>
                    <MdChevronRight className="ml-1 mt-[6px] text-gray-700" />

                </div>

            </div>
        
      </div>

      </div>
 

      {/* --- Menu Mobile (ouvert/fermé) --- */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
          <div className="flex flex-col px-4 py-3 gap-3 text-gray-700">
            <a href="#" className="hover:text-[#FF5C02] transition-colors">
              Accueil
            </a>
            <div className="flex items-center hover:text-[#FF5C02] transition-colors cursor-pointer">
              <span>Catégories</span>
              <FaAngleDown className="ml-1" />
            </div>
            <a href="#" className="hover:text-[#FF5C02] transition-colors">
              Boutique
            </a>

            <hr className="my-2" />

            <button className="w-full py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100 transition-colors">
              Connexion
            </button>
            <button className="w-full py-2 rounded-md bg-[#FF5C02] text-white hover:bg-[#e35400] transition-colors">
              Inscription
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
