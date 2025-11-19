import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";

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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

const login = async (email: string, password: string) => {
  const response = await fetch("https://durama-project.onrender.com/api/token/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Identifiants invalides");
  }

  const data = await response.json();
  localStorage.setItem("token", data.access);

  const userResponse = await fetch("https://durama-project.onrender.com/infoUser/", {
    headers: { Authorization: `Bearer ${data.access}` },
  });

  if (!userResponse.ok) {
    throw new Error("Impossible de récupérer les infos utilisateur.");
  }

  const userData: User = await userResponse.json();

  setUser(userData);
  localStorage.setItem("user", JSON.stringify(userData));

  // 🔥 Affichage dans la console
  console.log("isAuthenticated =", !!userData);
};


  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
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
