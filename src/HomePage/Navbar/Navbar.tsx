import { useEffect, useState } from "react";
import { FaAngleDown, FaBars, FaXmark } from "react-icons/fa6";
import { FaTools, FaPaintRoller,  FaAngleUp,  FaHardHat, FaHome, FaStore, FaPhone, FaInfoCircle } from "react-icons/fa";
import { GiBrickWall } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { MdChevronRight } from "react-icons/md";
import { CiShoppingCart } from "react-icons/ci";
import { RiSearch2Line } from "react-icons/ri";
import { LuShoppingCart } from "react-icons/lu";
import axiosInstance from "../../utils/axiosInstance";
import { useAuth } from "../../context/AuthContext";


const Navbar = () => {
  interface Produit {
    id: number;
    nom: string;
    slug: string;
    description_court: string;
    prix_vente: string;
    image_principale: string;
  }

  interface PanierItem {
    id: number;
    quantite: number;
    produit: Produit;
  }

  // État pour les catégories
  const categories = [
    {
      id: 'gros-oeuvres',
      name: 'Gros Œuvres',
      icon: GiBrickWall,
      description: 'Matériaux de structure et fondation',
      sousCategories: ['Béton & Ciment', 'Acier & Ferraillage', 'Matériaux de gros œuvre', 'Drainage'],
      color: 'bg-blue-50 border-blue-200 text-blue-600'
    },
    {
      id: 'second-oeuvres',
      name: 'Second Œuvres',
      icon: FaPaintRoller,
      description: 'Matériaux de finition et aménagement',
      sousCategories: ['Isolation', 'Cloisons', 'Menuiserie', 'Revêtements'],
      color: 'bg-green-50 border-green-200 text-green-600'
    },
    {
      id: 'outillage',
      name: 'Outillage',
      icon: FaTools,
      description: 'Outils professionnels et équipements',
      sousCategories: ['Outils électroportatifs', 'Outils manuels', 'Matériel de mesure', 'Équipement de chantier'],
      color: 'bg-orange-50 border-orange-200 text-orange-600'
    },
    {
      id: 'securité',
      name: 'Sécurité',
      icon: FaHardHat,
      description: 'Équipements de protection individuelle',
      sousCategories: ['Protection individuelle', 'Signalisation', 'Antichute', 'Hygiène et sécurité'],
      color: 'bg-red-50 border-red-200 text-red-600'
    }
  ];

 
  const [deuxDernierProduits, setdeuxDernierProduit] = useState<Produit[]>([]);
  const [deuxcontenu, setDeuxContenu] = useState<PanierItem[]>([]);
  const [total, setTotal] = useState<string>("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [extension, setExtension] = useState(false);
  const [nombreElement,setNombreElement]=useState(Number)
  const [panierExtension, setPanierExtension] = useState(false);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);
  const {isAuthenticated}=useAuth()
  const [categorieActive, setCategorieActive] = useState<string | null>(null);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

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



  {/*const toggleMenu = () => setMenuOpen(!menuOpen);*/}
  const toggleExtension = () => {
    setExtension(!extension);
    if (!extension) {
      setCategorieActive(null);
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access");
      try {
        const response = await axiosInstance.get("nombre_element/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setNombreElement(response.data);
        console.log(response.data)
      } catch (err: any) {
        console.log(err.message);
      }
    };
    fetchData();
  }, []);



  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access");
      try {
        const response = await axiosInstance.get("recuperer-deux-produits/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setdeuxDernierProduit(response.data);
      } catch (err: any) {
        console.log(err.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access");
      try {
        const response = await axiosInstance.get("/deuxelement/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDeuxContenu(response.data);
      } catch (err: any) {
        console.log(err.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access");
      try {
        const response = await axiosInstance.get("/prix_total/",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTotal(response.data);
      } catch (err: any) {
        console.log(err.message);
      }
    };
    fetchData();
  }, []);

  const handleCategorieClick = (categorieId: string) => {
    navigate(`/produits/${categorieId}`);
    setExtension(false);
    setMenuOpen(false);
    setMobileCategoriesOpen(false);
    setCategorieActive(null);
  };

  const closeAllMenus = () => {
    setMenuOpen(false);
    setMobileCartOpen(false);
    setMobileCategoriesOpen(false);
  };

  return (
    <nav className="bg-white shadow-lg border-b border-gray-100 py-4 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <div className="flex-shrink-0">
              <div className="text-2xl font-bold text-black">
                BTPStore
              </div>
            </div>

            {/* Menu Desktop */}
            <div className="hidden lg:flex items-center gap-8 text-gray-700 font-medium">
              <a href="/" className="hover:text-black transition-colors duration-200 py-2 font-semibold">
                Accueil
              </a>
              
              {/* Catégories avec toggle au clic */}
              <div className="relative">
                <button
                  onClick={toggleExtension}
                  className="flex items-center hover:text-black cursor-pointer transition-colors duration-200 py-2 font-semibold group"
                >
                  <span>Catégories</span>
                  {extension ? (
                    <FaAngleUp className="ml-2 transition-transform duration-200" />
                  ) : (
                    <FaAngleDown className="ml-2 transition-transform duration-200" />
                  )}
                </button>
              </div>
              
              <a href="/Boutique" className="hover:text-black transition-colors duration-200 py-2 font-semibold">
                Boutique
              </a>
              <a onClick={()=>navigate('/contact')} className="hover:text-black cursor-pointer transition-colors duration-200 py-2 font-semibold">
                Contact
              </a>
              <a href="#" className="hover:text-black transition-colors duration-200 py-2 font-semibold">
                À propos
              </a>
            </div>
          </div>

          {/* Boutons de droite (Desktop) */}
          <div className="hidden lg:flex items-center gap-6">
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
              <RiSearch2Line size={20} className="text-gray-600" />
            </button>
            
            <div className="relative">
              <button
                onMouseEnter={() => setPanierExtension(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 relative"
              >
                <CiShoppingCart size={22} className="text-gray-600" />
                
                  <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {isAuthenticated ? nombreElement : 0}
                  </span>
                
              </button>
            </div>
            {
              !isAuthenticated ?
              <div className="flex items-center gap-3">
              <button onClick={()=>navigate('/Profil')} className="px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 rounded-lg font-semibold">
                Connexion
              </button>
              <button className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition-all duration-200 rounded-lg font-semibold shadow-sm">
                Inscription
              </button>
            </div>
            :
              <div className="w-[25px] h-[25px] rounded-full border border-gray-500">
              <img className="w-full h-full rounded-full" src={`https://durama-project.onrender.com${user.photo}`}/>
              </div>
            }
            

          </div>

          {/* Menu mobile */}
          <div className="lg:hidden flex items-center gap-4">
            <button 
              onClick={() => {
                setMobileCartOpen(!mobileCartOpen);
                setMenuOpen(false);
              }}
              className="p-2 relative"
            >
              <LuShoppingCart size={22} className="text-gray-600" />
              {deuxcontenu.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {isAuthenticated ? nombreElement:0}
                </span>
              )}
            </button>
            <button 
              onClick={() => {
                setMenuOpen(!menuOpen);
                setMobileCartOpen(false);
              }}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              {menuOpen ? <FaXmark size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Dropdown Catégories - Desktop */}
        {extension && (
          <div
            className="absolute top-full left-0 right-0 bg-white border-t border-gray-200 shadow-xl z-50"
          >
            <div className="max-w-7xl mx-auto px-8 py-8">
              <div className="grid grid-cols-12 gap-8">
                {/* Navigation des catégories */}
                <div className="col-span-4 border-r border-gray-100 pr-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Nos Catégories</h3>
                  <div className="space-y-2">
                    {categories.map((categorie) => {
                      const Icon = categorie.icon;
                      return (
                        <div
                          key={categorie.id}
                          onMouseEnter={() => setCategorieActive(categorie.id)}
                          onClick={() => handleCategorieClick(categorie.id)}
                          className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                            categorieActive === categorie.id
                              ? 'bg-gray-100 border border-gray-300'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${
                              categorieActive === categorie.id
                                ? 'bg-black text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}>
                              <Icon size={20} />
                            </div>
                            <div className="flex-1">
                              <h4 className={`font-semibold ${
                                categorieActive === categorie.id ? 'text-black' : 'text-gray-900'
                              }`}>
                                {categorie.name}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">
                                {categorie.description}
                              </p>
                            </div>
                            <MdChevronRight 
                              className={`text-gray-400 transition-transform duration-200 ${
                                categorieActive === categorie.id ? 'rotate-90 text-black' : ''
                              }`} 
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sous-catégories */}
                <div className="col-span-5">
                  {categorieActive && (
                    <>
                      <h3 className="text-lg font-bold text-gray-900 mb-6">
                        Sous-catégories
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        {categories
                          .find(cat => cat.id === categorieActive)
                          ?.sousCategories.map((sousCat, index) => (
                            <div
                              key={index}
                              onClick={() => handleCategorieClick(categorieActive)}
                              className="p-4 border border-gray-200 rounded-lg hover:border-black hover:bg-gray-50 cursor-pointer transition-all duration-200 group"
                            >
                              <h4 className="font-medium text-gray-900 group-hover:text-black">
                                {sousCat}
                              </h4>
                              <p className="text-sm text-gray-500 mt-1">
                                Découvrir les produits
                              </p>
                            </div>
                          ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Derniers articles */}
                <div className="col-span-3 pl-8 border-l border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Derniers articles</h3>
                  <div className="space-y-6">
                    {deuxDernierProduits.map((prod, index) => (
                      <div 
                        key={index} 
                        className="group cursor-pointer"
                        onClick={() => {
                          navigate(`/produit/${prod.slug}`);
                          setExtension(false);
                        }}
                      >
                        <div className="flex gap-4">
                          <img
                            className="w-16 h-16 rounded-lg object-cover group-hover:scale-105 transition-transform duration-200"
                            src={`https://durama-project.onrender.com${prod.image_principale}`}
                            alt={prod.nom}
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-black">
                              {prod.nom}
                            </p>
                            <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                              {prod.description_court}
                            </p>
                            <button
                              className="text-black text-xs font-medium mt-2 hover:text-gray-700 underline"
                            >
                              Lire plus
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Panier Desktop */}
        {panierExtension && (
          <div
            onMouseLeave={() => setPanierExtension(false)}
            className="absolute right-8 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
          >
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Votre Panier</h3>
              
              {deuxcontenu.length === 0 || !isAuthenticated  ? (
                <div className="text-center py-8">
                  <CiShoppingCart size={48} className="text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Votre panier est vide</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {deuxcontenu.map((prod, index) => (
                    <div onClick={()=>navigate(`Produit/${prod.produit.slug}/`)} key={index} className="flex cursor-pointer items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          className="w-full h-full object-cover"
                          alt={prod.produit.nom}
                          src={`https://durama-project.onrender.com${prod.produit.image_principale}`}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {prod.produit.nom}
                        </p>
                        <p className="text-xs text-gray-500">
                          {prod.quantite} × {prod.produit.prix_vente} GNF
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {deuxcontenu.length > 0  && isAuthenticated && (
                <>
                  <div className="border-t border-gray-200 my-4" />
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm font-medium text-gray-700">Total</span>
                    <span className="text-lg font-bold text-gray-900">{total} GNF</span>
                  </div>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        navigate('/Panier');
                        setPanierExtension(false);
                      }}
                      className="w-full py-3 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors duration-200 rounded-lg font-semibold"
                    >
                      Voir le panier
                    </button>
                    <button className="w-full py-3 bg-black text-white hover:bg-gray-800 transition-all duration-200 rounded-lg font-semibold">
                      Commander
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Menu Mobile Amélioré */}
        {menuOpen && (
          <div className="lg:hidden fixed inset-0  bg-opacity-50 z-50">
            <div className="absolute top-0 right-0 h-full w-80 bg-white shadow-xl">
              {/* Header du menu mobile */}
              <div className="p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-xl font-bold text-black">Menu</div>
                  <button 
                    onClick={closeAllMenus}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FaXmark size={20} className="text-gray-600" />
                  </button>
                </div>
                
                {/* Recherche mobile */}
                <div className="relative mb-4">
                  <RiSearch2Line className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
              </div>

              {/* Navigation mobile */}
              <div className="p-6 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
                {/* Accueil */}
                <button
                  onClick={() => { navigate('/'); closeAllMenus(); }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-left"
                >
                  <FaHome className="text-gray-600" size={20} />
                  <span className="font-semibold text-gray-900">Accueil</span>
                </button>

                {/* Catégories avec accordéon */}
                <div className="border-b border-gray-100 pb-2">
                  <button
                    onClick={() => setMobileCategoriesOpen(!mobileCategoriesOpen)}
                    className="w-full flex items-center justify-between gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-4">
                      <GiBrickWall className="text-gray-600" size={20} />
                      <span className="font-semibold text-gray-900">Catégories</span>
                    </div>
                    {mobileCategoriesOpen ? <FaAngleUp className="text-gray-400" /> : <FaAngleDown className="text-gray-400" />}
                  </button>

                  {mobileCategoriesOpen && (
                    <div className="ml-12 mt-2 space-y-3">
                      {categories.map((categorie) => {
                        const Icon = categorie.icon;
                        return (
                          <button
                            key={categorie.id}
                            onClick={() => handleCategorieClick(categorie.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${categorie.color}`}
                          >
                            <Icon size={18} />
                            <span className="font-medium text-sm">{categorie.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Boutique */}
                <button
                  onClick={() => { navigate('/Boutique'); closeAllMenus(); }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-left"
                >
                  <FaStore className="text-gray-600" size={20} />
                  <span className="font-semibold text-gray-900">Boutique</span>
                </button>

                {/* Contact */}
                <button
                  onClick={() => { navigate('/contact'); closeAllMenus(); }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-left"
                >
                  <FaPhone className="text-gray-600" size={20} />
                  <span className="font-semibold text-gray-900">Contact</span>
                </button>

                {/* À propos */}
                <button
                  onClick={() => { navigate('/about'); closeAllMenus(); }}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors duration-200 text-left"
                >
                  <FaInfoCircle className="text-gray-600" size={20} />
                  <span className="font-semibold text-gray-900">À propos</span>
                </button>

                {/* Séparateur */}
                <div className="border-t border-gray-200 my-4" />

                {/* Boutons de connexion */}
                {
                  !isAuthenticated  ?
                <div className="space-y-3 pt-4">
                  <button 
                    onClick={() => { navigate('/Profil'); closeAllMenus(); }}
                    className="w-full py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                  >
                    Connexion
                  </button>
                  <button 
                    onClick={() => { navigate('/register'); closeAllMenus(); }}
                    className="w-full py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200 shadow-sm"
                  >
                    Inscription
                  </button>
                </div>:
                <div></div>
                }

              </div>
            </div>
          </div>
        )}

        {/* Panier Mobile Amélioré */}
        {mobileCartOpen && (
          <div  className="lg:hidden fixed inset-0  bg-opacity-50 z-50">
            <div className="absolute top-0 right-0 h-full w-80 bg-white shadow-xl">
              {/* Header du panier mobile */}
              <div className="p-6 border-b border-gray-200 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xl font-bold text-black">Votre Panier</div>
                  <button 
                    onClick={() => setMobileCartOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <FaXmark size={20} className="text-gray-600" />
                  </button>
                </div>
                <p className="text-sm text-gray-500">{isAuthenticated ? nombreElement  : 0 } article{nombreElement > 1 && isAuthenticated ? 's' : ''} </p>
              </div>

              {/* Contenu du panier mobile */}
              <div className="p-6 overflow-y-auto h-[calc(100vh-200px)]">
                {deuxcontenu.length === 0 || !isAuthenticated ? (
                  <div className="text-center py-12">
                    <CiShoppingCart size={64} className="text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium mb-2">Votre panier est vide</p>
                    <p className="text-gray-400 text-sm">Ajoutez des produits pour commencer</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deuxcontenu.map((prod, index) => (
                      <div onClick={()=>navigate(`produit/${prod.produit.slug}/`)} key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-200">
                          <img
                            className="w-full h-full object-cover"
                            alt={prod.produit.nom}
                            src={`https://durama-project.onrender.com${prod.produit.image_principale}`}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 text-sm line-clamp-2">
                            {prod.produit.nom}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            Quantité: {prod.quantite}
                          </p>
                          <p className="text-black font-bold text-sm mt-1">
                            {prod.produit.prix_vente} GNF
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {deuxcontenu.length > 0 && isAuthenticated  && (
                  <>
                    <div className="border-t border-gray-200 my-6" />
                    <div className="flex justify-between items-center mb-6">
                      <span className="font-semibold text-gray-900">Total</span>
                      <span className="text-xl font-bold text-black">{total} GNF</span>
                    </div>
                    <div className="space-y-3">
                      <button
                        onClick={() => {
                          navigate('/Panier');
                          setMobileCartOpen(false);
                        }}
                        className="w-full py-4 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
                      >
                        Voir le panier
                      </button>
                      <button 
                        onClick={() => {
                          navigate('/checkout');
                          setMobileCartOpen(false);
                        }}
                        className="w-full py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200"
                      >
                        Commander
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;