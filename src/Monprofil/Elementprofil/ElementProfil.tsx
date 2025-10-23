import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import axiosInstance from "../../utils/axiosInstance";

interface User {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  address: string;
  bio: string;
  date_joined: string;
  favoris: number;
  photo: string | File; 
}

const Profil = () => {
  const navigate = useNavigate();
  const [Favori,setFavori]=useState("")
  const [isEditing, setIsEditing] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);
  const [nombreCommande, setNombreCommande] = useState<string>("");

  const [user, setUser] = useState<User>({
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    address: "",
    bio: "",
    date_joined: "",
    favoris: 0,
    photo: "",
  });

  // Charger les infos de commandes
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("access");
      if (!token) return;

      try {
        const response = await axiosInstance.get("/nombreCommande/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setNombreCommande(response.data);
      } catch (err: any) {
        console.log(err.message);
      }
    };
    fetchData();
  }, []);

  useEffect(()=>{
    const fetchData = async ()=>{
        const token = localStorage.getItem("access")
        try{
            const nombreFavoris = await axiosInstance.get("/nombreFavori/",
                {
                   headers: { Authorization: `Bearer ${token}` }, 
                }
            )
            setFavori(nombreFavoris.data)
        }catch(err:any){
            console.log(err.message)
        }
    }
    fetchData()
  },[])

  // Charger les infos du profil
  useEffect(() => {
    const token = localStorage.getItem("access");
    {/*if (!token) {
      navigate("/Profil");
      return;
    }*/}

    axiosInstance
      .get("/infoUser/", {
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
          favoris: data.favoris_count || 1,
          photo:
            data.photo == null
              ? "https://cdn-icons-png.flaticon.com/512/847/847969.png"
              : `http://127.0.0.1:8004${data.photo}`,
        });
      })
      .catch((error) => {
        console.error("Erreur lors du chargement du profil :", error);
        navigate("/Profil");
      });
  }, [navigate]);

  // Gérer la déconnexion
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.setItem("isAuthenticated", "false");
    navigate("/Profil");
  };

  // Gérer la modification
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setPreviewPhoto(null);
    }
  };

  // Gérer le changement d'image
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewPhoto(URL.createObjectURL(file));
      setUser({ ...user, photo: file });
    }
  };

  // Gérer la sauvegarde
  const handleSave = async () => {
    const token = localStorage.getItem("access");
    if (!token) return;

    const formData = new FormData();
    formData.append("first_name", user.first_name);
    formData.append("last_name", user.last_name);
    formData.append("phone_number", user.phone_number);
    formData.append("address", user.address);
    formData.append("bio", user.bio);

    if (user.photo instanceof File) {
      formData.append("photo", user.photo);
    }

    try {
      await axiosInstance.put("/infoUser/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Profil mis à jour avec succès ✅");
      setIsEditing(false);
      setPreviewPhoto(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Erreur lors de la mise à jour du profil ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center overflow-y-auto p-4">
      {/* Carte Profil principale */}
      <div className="bg-white rounded-3xl  w-full max-w-md mt-6 p-8 flex flex-col items-center border border-gray-100">
        
        {/* Avatar avec effet sophistiqué */}
        <div className="relative mb-6">
          <div className="absolute -inset-2 bg-gradient-to-r from-black to-gray-800 rounded-full blur-sm opacity-20"></div>
            <img
                src={
                previewPhoto
                ? previewPhoto
                : user.photo
                ? typeof user.photo === "string"
                ? user.photo
                    : URL.createObjectURL(user.photo)
                : "https://cdn-icons-png.flaticon.com/512/847/847969.png" // image par défaut
                }
                alt="Profil"
              className="w-32 h-32 rounded-full border-4 border-white shadow-xl relative z-10 object-cover"
            />

          {isEditing && (
            <label className="absolute bottom-2 right-2 bg-black text-white p-2 rounded-full cursor-pointer shadow-lg hover:bg-gray-800 transition-all duration-300">
              <span className="text-sm">📷</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoChange} 
                className="hidden" 
              />
            </label>
          )}
        </div>

        {/* Nom et bio */}
        {!isEditing ? (
          <>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
              {user.first_name} {user.last_name}
            </h2>
            <p className="text-gray-600 text-sm text-center mb-6 px-4 leading-relaxed">
              {user.bio}
            </p>
          </>
        ) : (
          <div className="w-full space-y-4 mb-6">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={user.first_name}
                onChange={(e) => setUser({ ...user, first_name: e.target.value })}
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Prénom"
              />
              <input
                type="text"
                value={user.last_name}
                onChange={(e) => setUser({ ...user, last_name: e.target.value })}
                className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Nom"
              />
            </div>
            <textarea
              value={user.bio}
              onChange={(e) => setUser({ ...user, bio: e.target.value })}
              className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none"
              placeholder="Bio"
              rows={3}
            ></textarea>
          </div>
        )}

        {/* Bouton modifier / sauvegarder */}
        {!isEditing ? (
          <button
            onClick={handleEditToggle}
            className="w-full bg-black text-white py-4 rounded-xl hover:bg-gray-800 transition-all duration-300 font-medium shadow-lg hover:shadow-xl mb-6 flex items-center justify-center gap-2"
          >
            <span>✏️</span>
            Modifier le profil
          </button>
        ) : (
          <div className="flex gap-3 w-full mb-6">
            <button
              onClick={handleSave}
              className="flex-1 bg-black text-white py-4 rounded-xl hover:bg-gray-800 font-medium shadow-lg hover:shadow-xl flex items-center justify-center gap-2 transition-all duration-300"
            >
              <span>💾</span>
              Sauvegarder
            </button>
            <button
              onClick={handleEditToggle}
              className="flex-1 bg-white border border-gray-300 text-gray-800 py-4 rounded-xl hover:bg-gray-50 hover:border-gray-400 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2 transition-all duration-300"
            >
              <span>❌</span>
              Annuler
            </button>
          </div>
        )}

        {/* Infos personnelles */}
        <div className="bg-gray-50 rounded-2xl shadow-sm p-6 w-full mb-6 border border-gray-200">
          <div className="flex items-center mb-5">
            <div className="w-1.5 h-6 bg-black rounded-full mr-3"></div>
            <h3 className="text-gray-900 font-bold text-lg">Informations personnelles</h3>
          </div>

          <div className="space-y-4">
            {/* Email - Non éditable */}
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <span className="font-medium text-gray-600 text-sm">Email</span>
              <span className="text-gray-900 font-semibold text-sm text-right">
                {user.email}
              </span>
            </div>

            {/* Champs éditables */}
            {["phone_number", "address"].map((field) => (
              <div key={field} className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="font-medium text-gray-600 text-sm">
                  {field === "phone_number" ? "Téléphone" : "Adresse"}
                </span>
                {!isEditing ? (
                  <span className="text-gray-900 font-semibold text-sm text-right max-w-[60%]">
                    {user[field as keyof typeof user] as string}
                  </span>
                ) : (
                  <input
                    type="text"
                    value={user[field as keyof typeof user] as string}
                    onChange={(e) => setUser({ ...user, [field]: e.target.value })}
                    className="w-[60%] border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-transparent"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Statistiques */}
        <div className="w-full mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm text-center py-5 hover:shadow-md transition-all duration-300 group">
              <p className="text-black font-bold text-2xl mb-2 group-hover:scale-105 transition-transform duration-300">
                {nombreCommande}
              </p>
              <p className="text-gray-600 text-sm font-medium">Commandes</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm text-center py-5 hover:shadow-md transition-all duration-300 group">
              <p className="text-black font-bold text-2xl mb-2 group-hover:scale-105 transition-transform duration-300">
                {Favori}
              </p>
              <p className="text-gray-600 text-sm font-medium">En favoris</p>
            </div>
          </div>
        </div>

        {/* Déconnexion */}
        <button
          onClick={handleLogout}
          className="w-full bg-white border border-gray-300 text-gray-800 py-4 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium shadow-sm hover:shadow-md flex items-center justify-center gap-2"
        >
          <span>🚪</span>
          Déconnexion
        </button>
      </div>

      {/* Date d'inscription */}
      <div className="mt-6 text-center">
        <p className="text-gray-400 text-xs font-medium">
          Membre depuis le {user.date_joined}
        </p>
      </div>

      <div className="h-10"></div>
    </div>
  );
};

export default Profil;