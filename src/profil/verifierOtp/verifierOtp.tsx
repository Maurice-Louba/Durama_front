// VerifyEmail.tsx
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
const VerifyEmail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (otp.length !== 6) {
      setError("Le code doit contenir 6 chiffres");
      setLoading(false);
      return;
    }

    try {
      // Appel API pour vérifier le code OTP
       await axios.post(
        "https://durama-project.onrender.com/verify_otp/", 
        { email,
        otp, }
      );
      setSuccess("Email vérifié avec succès !");
      alert("Votre email a été vérifié !");
      navigate("/MonProfil"); 
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || "Code invalide ou expiré");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-white items-center justify-center min-h-screen">
      <div className="bg-white w-[400px] md:w-[450px] rounded-xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Vérification de votre email
        </h2>
        <p className="text-center text-sm text-gray-500 mt-2">
          Entrez le code reçu par mail
        </p>

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

        <form onSubmit={handleVerify}>
          <div className="mt-8">
            <label className="text-gray-700 text-sm font-medium">Code OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="123456"
              className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-gray-700"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 ${
              loading ? "bg-gray-600" : "bg-black hover:bg-gray-900"
            } text-white py-2 rounded-lg font-medium transition`}
          >
            {loading ? "Vérification..." : "Vérifier mon email"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Vous n'avez pas reçu le code ?{" "}
          <a href="/resend-otp" className="text-black hover:underline font-medium">
            Renvoyer le code
          </a>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
