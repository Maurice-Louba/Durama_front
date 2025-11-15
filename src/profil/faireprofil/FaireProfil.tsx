// SignUpForm.tsx
import { FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const SignUpForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Validation simple côté front
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email invalide");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
       await axios.post(
        "http://127.0.0.1:8004/register/", // 
        { email, password }
      );
      setSuccess("Compte créé avec succès !");
      alert("Compte créé !");
      navigate("/VerifierOtp",{ state: { email } }); 
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Erreur lors de la création du compte");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-white items-center justify-center min-h-screen ">
      <div className="bg-white w-[400px] md:w-[450px] rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Créez votre compte
        </h2>

        {error && (
          <div className="mt-4 bg-red-100 text-red-600 text-sm p-2 rounded-lg text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="mt-4 bg-green-100 text-green-600 text-sm p-2 rounded-lg text-center">
            {success}
          </div>
        )}

        <form onSubmit={handleSignUp}>
          {/* Email */}
          <div className="mt-8">
            <label className="text-gray-700 text-sm font-medium">Email</label>
            <div className="flex items-center mt-2 border border-gray-300 rounded-lg px-3">
              <FaEnvelope className="text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
                className="w-full px-3 py-2 focus:outline-none text-gray-700"
                required
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div className="mt-4">
            <label className="text-gray-700 text-sm font-medium">Mot de passe</label>
            <div className="flex items-center mt-2 border border-gray-300 rounded-lg px-3">
              <FaLock className="text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                className="w-full px-3 py-2 focus:outline-none text-gray-700"
                required
              />
            </div>
          </div>

          {/* Confirmation du mot de passe */}
          <div className="mt-4">
            <label className="text-gray-700 text-sm font-medium">
              Confirmer le mot de passe
            </label>
            <div className="flex items-center mt-2 border border-gray-300 rounded-lg px-3">
              <FaLock className="text-gray-400" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="********"
                className="w-full px-3 py-2 focus:outline-none text-gray-700"
                required
              />
            </div>
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 ${
              loading ? "bg-gray-600" : "bg-black hover:bg-gray-900"
            } text-white py-2 rounded-lg font-medium transition`}
          >
            {loading ? "Création..." : "Créer mon compte"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà un compte ?{" "}
          <a href="/login" className="text-black hover:underline font-medium">
            Connectez-vous
          </a>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;
