import { useEffect, useState } from "react";
import { FaAngleDown, FaBars, FaXmark } from "react-icons/fa6";
import { FaTools, FaPaintRoller, FaPenNib, FaBookOpen,FaAngleUp, FaGraduationCap, FaHardHat, FaHandshake } from "react-icons/fa";
import { GiBrickWall } from "react-icons/gi";
import { MdChevronRight } from "react-icons/md";
import { CiShoppingCart } from "react-icons/ci";
import { RiSearch2Line } from "react-icons/ri";
import { LuShoppingCart } from "react-icons/lu";
import fer from "./../../assets/Images/iron-rods-474792_1280.jpg";
import marteau from "./../../assets/Images/welded-wire-mesh-3630567_1280.jpg";
import axiosInstance from "../../utils/axiosInstance";




const Navbar = () => {

  interface Produit {
  id: number;
  nom: string;
  prix_vente: string;      // ou number si ton backend renvoie un chiffre
  image_principale: string;
}

// Type pour un élément de panier
interface PanierItem {
  id: number;
  quantite: number;       // si tu gères la quantité
  produit: Produit;       // <-- ton objet produit
}
  
const [contenuPanier, setContenuPanier] = useState<PanierItem[]>([]);
const [deuxcontenu, setDeuxContenu] = useState<PanierItem[]>([]);
const [total, setTotal] = useState<string>("");
  useEffect(()=>{
    const fetchData = async ()=>{
      const token = localStorage.getItem("access");
      try{
        const response = await axiosInstance.get("/panier/items/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        setContenuPanier(response.data)
        console.log(response.data)
      }catch(err:any){
        console.log(err.message)
      }
    }
    fetchData()
  },[])


    useEffect(()=>{
    const fetchData = async ()=>{
      const token = localStorage.getItem("access");
      try{
        const response = await axiosInstance.get("/deuxelement/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        setDeuxContenu(response.data)
        console.log(response.data)
      }catch(err:any){
        console.log(err.message)
      }
    }
    fetchData()
  },[])
    useEffect(()=>{
    const fetchData = async ()=>{
      const token = localStorage.getItem("access");
      try{
        const response = await axiosInstance.get("/prix_total/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        setTotal(response.data)
        console.log(response.data)
      }catch(err:any){
        console.log(err.message)
      }
    }
    fetchData()
  },[])
  
  const [menuOpen, setMenuOpen] = useState(false);
  const [extension, setExtension] = useState(false);
  const [panierExtension, setPanierExtension] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleExtension = () => setExtension(!extension);

  return (
    <nav className="bg-[#F5F5F5] shadow-sm py-6 relative">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* --- Logo --- */}
          <div className="flex items-center justify-center gap-6">
            <div className="flex-shrink-0 text-2xl font-bold">
              Logo
            </div>

            {/* --- Menu Desktop --- */}
            <div className="hidden md:flex items-center gap-6 text-gray-700 font-medium">
              <a href="/" className="hover:text-[#FF5C02] transition-colors">
                Accueil
              </a>
              <div
                onClick={toggleExtension}
                onMouseEnter={() => setExtension(true)}
                className="flex items-center hover:text-[#FF5C02] cursor-pointer transition-colors"
              >
                <span>Catégories</span>
                {extension ? <FaAngleUp className="ml-1" /> : <FaAngleDown className="ml-1" />}
              </div>
              <a href="/Boutique" className="hover:text-[#FF5C02] transition-colors">
                Boutique
              </a>
              <a href="#" className="hover:text-[#FF5C02] transition-colors">
                Contact
              </a>
              <a href="#" className="hover:text-[#FF5C02] transition-colors">
                À propos
              </a>
            </div>
          </div>

          {/* --- Boutons de droite (Desktop) --- */}
          <div className="hidden md:flex items-center gap-4">
            <RiSearch2Line size={24} className="text-black" />
            <CiShoppingCart
              onMouseEnter={() => setPanierExtension(true)}
              size={24}
              className="text-black cursor-pointer"
            />
            <button className="px-5 py-2 border border-gray-400 text-black hover:bg-gray-100 transition-colors">
              Connexion
            </button>
            <button className="px-5 py-2 bg-[#FF5C02] text-white hover:bg-[#e35400] transition-colors">
              Inscription
            </button>
          </div>

          {/* --- Menu mobile (icônes) --- */}
          <div className="md:hidden flex items-center gap-4">
            <LuShoppingCart
              size={24}
              className="text-black cursor-pointer"
              onClick={() => setMobileCartOpen(!mobileCartOpen)}
            />
            <button onClick={toggleMenu} className="text-2xl text-black">
              {menuOpen ? <FaXmark /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* --- Panier Desktop --- */}
        {panierExtension && (
          <div
            onMouseLeave={() => setPanierExtension(false)}
            className="absolute right-8 top-[90px] w-[300px] bg-white  shadow-lg rounded-lg p-4 z-50"
          >
            <div className="h-[90px] flex items-center justify-center">
              {deuxcontenu.length==0?(<p className="text-gray-500">Votre panier est vide</p>):
              (
                <div>
                  {
                    deuxcontenu.map((prod,index) =>(
                      <div key={index} className="flex items-center justify-between  gap-18">
                        
                        <div className="w-[50px] h-[50px] overflow-hidden rounded-full border-gray-400">
                          <img className="w-full h-full object-cover" alt={prod.produit.nom} src={`http://127.0.0.1:8004/${prod.produit.image_principale}`}/>
                          

                        </div>
                        <div>
                        <p className="text-gray-600">
                          {prod.produit.nom}
                          
                        </p>
                        <p className="flex text-gray-400 justify-end items-end">
                          {prod.produit.prix_vente}
                          
                        </p>
                        </div>

                      </div>
                    ))
                  }
                </div>
              )}
            </div>
            <div className="w-full mt-6 bg-gray-300 h-[1px] my-2" />
            <div className="flex justify-between text-gray-600 text-sm">
              <p>Total</p>
              <p>{total} FGN</p>
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <button className="px-5 py-2 border border-gray-400 text-black hover:bg-gray-100 transition-colors rounded-md">
                Voir panier
              </button>
              <button className="px-5 py-2 bg-black text-white hover:bg-gray-900 transition-colors rounded-md">
                Commander
              </button>
            </div>
          </div>
        )}

        {/* --- Panier Mobile --- */}
        {mobileCartOpen && (
          <div className="absolute top-[70px] right-4 left-4 bg-white rounded-lg shadow-lg p-4 z-50">
            <div className="flex flex-col items-center justify-center">
              {deuxcontenu.length==0?(<p className="text-gray-500">Votre panier est vide</p>):
              (
                <div>
                  {
                    deuxcontenu.map((prod,index) =>(
                      <div key={index} className="flex  w-full gap-36 justify-between">
                        
                        <div className="w-[50px] h-[50px] overflow-hidden rounded-full border-gray-400">
                          <img className="w-full h-full object-cover" alt={prod.produit.nom} src={`http://127.0.0.1:8004${prod.produit.image_principale}`}/>
                          

                        </div>
                        <div>
                        <p className="text-gray-600">
                          {prod.produit.nom}
                          
                        </p>
                        <p className="flex text-gray-400 justify-end items-end">
                          {prod.produit.prix_vente}
                          
                        </p>
                        </div>

                      </div>
                    ))
                  }
                </div>
              )}
              {contenuPanier.length>2 ?(
                    <div className=" text-white justify-end flex">
                <button className="w-[100px] bg-black rounded-2xl h-[30px]">
                  Voir tout
                </button>

              </div>
              ):<></>}

              

              <div className="w-full h-[1px] bg-gray-500 mt-2"/>
              <div className="flex mt-2 w-full justify-between">
                <p className="text-gray-500">Total</p>
                <p className="text-gray-500">{total} FGN</p>

              </div>

              <div className="flex flex-col mt-2 gap-3 w-full">
                <button className="px-5 py-2 w-full bg-black text-white hover:bg-gray-900 rounded-md">
                  Commander
                </button>
                <button className="px-5 py-2 w-full border border-gray-400 text-black hover:bg-gray-100 rounded-md">
                  Voir panier
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- Menu Catégories --- */}
        {extension && (
          <div
            onMouseEnter={() => setExtension(true)}
            onMouseLeave={() => setExtension(false)}
            className="grid mt-6 grid-cols-3 gap-4"
          >
            {/* Colonne 1 */}
            <div className="py-6">
              <p className="font-bold text-gray-700">Nos Catégories</p>

              <div className="mt-8">
                <div className="flex items-center gap-2">
                  <GiBrickWall size={20} className="text-black" />
                  <p className="text-black font-bold">Gros-œuvres</p>
                </div>
                <p className="text-gray-500 font-medium ml-6">Une petite description...</p>
              </div>

              <div className="mt-8">
                <div className="flex items-center gap-2">
                  <FaPaintRoller size={20} className="text-black" />
                  <p className="text-black font-bold">Second-œuvres</p>
                </div>
                <p className="text-gray-500 font-medium ml-6">Une petite description...</p>
              </div>

              <div className="mt-8">
                <div className="flex items-center gap-2">
                  <FaTools size={20} className="text-black" />
                  <p className="text-black font-bold">Outillage</p>
                </div>
                <p className="text-gray-500 font-medium ml-6">Une petite description...</p>
              </div>

              <div className="mt-8 mb-10">
                <div className="flex items-center gap-2">
                  <FaHardHat size={20} className="text-black" />
                  <p className="text-black font-bold">Sécurité</p>
                </div>
                <p className="text-gray-500 font-medium ml-6">Une petite description...</p>
              </div>
            </div>

            {/* Colonne 2 */}
            <div className="py-6">
              <p className="font-bold text-gray-700">Actualités</p>

              <div className="mt-8">
                <div className="flex items-center gap-2">
                  <FaPenNib size={20} className="text-black" />
                  <p className="text-black font-bold">Blog</p>
                </div>
                <p className="text-gray-500 font-medium ml-6">Une petite description...</p>
              </div>

              <div className="mt-8">
                <div className="flex items-center gap-2">
                  <FaBookOpen size={20} className="text-black" />
                  <p className="text-black font-bold">Guides</p>
                </div>
                <p className="text-gray-500 font-medium ml-6">Une petite description...</p>
              </div>

              <div className="mt-8">
                <div className="flex items-center gap-2">
                  <FaGraduationCap size={20} className="text-black" />
                  <p className="text-black font-bold">Formation</p>
                </div>
                <p className="text-gray-500 font-medium ml-6">Une petite description...</p>
              </div>

              <div className="mt-8 mb-10">
                <div className="flex items-center gap-2">
                  <FaHandshake size={20} className="text-black" />
                  <p className="text-black font-bold">Partenaires</p>
                </div>
                <p className="text-gray-500 font-medium ml-6">Une petite description...</p>
              </div>
            </div>

            {/* Colonne 3 */}
            <div className="bg-white w-[530px] px-6 py-6">
              <p className="text-gray-700 font-bold">Derniers articles</p>

              <div className="flex mt-4 items-center">
                <img className="w-[150px] h-[100px] rounded-md" src={fer} />
                <div className="ml-4">
                  <p className="font-bold text-gray-700">Titre du produit</p>
                  <p className="mt-1 text-gray-500 text-sm">
                    Lorem ipsum dolor, sit amet...
                  </p>
                  <a href="#" className="mt-2 text-[#FF5C02] underline text-sm">
                    Lire plus
                  </a>
                </div>
              </div>

              <div className="flex mt-4 items-center">
                <img className="w-[150px] h-[100px] rounded-md" src={marteau} />
                <div className="ml-4">
                  <p className="font-bold text-gray-700">Titre du produit</p>
                  <p className="mt-1 text-gray-500 text-sm">
                    Lorem ipsum dolor, sit amet...
                  </p>
                  <a href="#" className="mt-2 text-[#FF5C02] underline text-sm">
                    Lire plus
                  </a>
                </div>
              </div>

              <div className="flex mt-4 items-center text-gray-700 cursor-pointer">
                <a>Voir plus d'articles</a>
                <MdChevronRight className="ml-1 mt-[3px]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* --- Menu Mobile --- */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
          <div className="flex flex-col px-4 py-3 gap-3 text-gray-700">
            <a href="/" className="hover:text-[#FF5C02] transition-colors">
              Accueil
            </a>
            <div className="flex items-center hover:text-[#FF5C02] transition-colors cursor-pointer">
              <span>Catégories</span>
              <FaAngleDown className="ml-1" />
            </div>
            <a href="/Boutique" className="hover:text-[#FF5C02] transition-colors">
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
