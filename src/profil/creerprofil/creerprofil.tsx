// src/components/LoginForm.tsx
import { FaEnvelope, FaLock, FaGoogle, FaFacebook } from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { useAuth } from "../../context/AuthContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
const handleconnexion = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    await login(email, password); // <-- On utilise AuthContext

    navigate("/MonProfil");
  } catch (err: any) {
    console.error(err);
    setError("Email ou mot de passe incorrect");
  } finally {
    setLoading(false);
  }
};


  // si déjà connecté, on peut rediriger :
  // (optionnel) : if (isLoggedIn()) navigate("/MonProfil");

  return (
    <div className="flex bg-white items-center justify-center min-h-screen ">
      <div className="bg-white w-[400px] md:w-[450px] rounded-xl p-8 shadow-xl border border-gray-100">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Connectez-vous à votre compte
        </h2>

        <p className="text-center text-sm text-gray-500 mt-2">
          Ou{" "}
          <span onClick={() => navigate("/SignUp")} className="text-black hover:underline font-medium cursor-pointer">
            créez un compte
          </span>
        </p>

        {error && (
          <div className="mt-4 bg-red-100 text-red-600 text-sm p-2 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleconnexion}>
          <div className="mt-8">
            <label className="text-gray-700 text-sm font-medium">Email</label>
            <div className="flex items-center mt-2 border border-gray-300 rounded-lg px-3">
              <FaEnvelope className="text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
                required
                className="w-full px-3 py-2 focus:outline-none text-gray-700"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="text-gray-700 text-sm font-medium">Mot de passe</label>
            <div className="flex items-center mt-2 border border-gray-300 rounded-lg px-3">
              <FaLock className="text-gray-400" />
              <input
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 focus:outline-none text-gray-700"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 text-sm">
            <label className="flex items-center gap-2 text-gray-600">
              <input type="checkbox" className="accent-black" />
              Se souvenir de moi
            </label>
            <a href="#" className="text-black hover:underline">
              Mot de passe oublié ?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 ${loading ? "bg-gray-600" : "bg-black hover:bg-gray-900"} text-white py-2 rounded-lg font-medium transition`}
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <div className="flex items-center my-6">
          <hr className="flex-1 border-gray-300" />
          <span className="mx-3 text-gray-500 text-sm">Ou continuer avec</span>
          <hr className="flex-1 border-gray-300" />
        </div>

        <div className="flex gap-4">
          <button className="flex items-center justify-center w-1/2 border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition">
            <FaGoogle className="text-red-500 mr-2" />
            Google
          </button>
          <button className="flex items-center justify-center w-1/2 border border-gray-300 rounded-lg py-2 hover:bg-gray-100 transition">
            <FaFacebook className="text-blue-600 mr-2" />
            Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
