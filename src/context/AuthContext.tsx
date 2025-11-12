import  { createContext, useContext, useState, useEffect } from "react";
import  type { ReactNode } from "react";

interface User {
  id?: number;
  first_name?: string;
  last_name?: string;
  email: string;
  bio?: string;
  phone_number?: string;
  address?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Vérifie si un token est stocké au chargement
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const login = async (email: string, password: string) => {
    // Exemple : Requête à ton API Django JWT
    const response = await fetch("http://127.0.0.1:8000/api/token/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      // data contient le token et potentiellement les infos user
      localStorage.setItem("token", data.access);

      // tu peux aussi récupérer les infos utilisateur :
      const userResponse = await fetch("http://127.0.0.1:8004/infoUser//", {
        headers: { Authorization: `Bearer ${data.access}` },
      });
      const userData = await userResponse.json();

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } else {
      throw new Error("Identifiants invalides");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
};
