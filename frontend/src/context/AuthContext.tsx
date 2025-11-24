import React, {
  createContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import {
  type User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";
import FullScreenLoader from "../components/common/FullScreenLoader";
import api from "../services/api";

export interface User {
  uid: string;
  name: string;
  email: string | null;
  registrationDate: string;
  avatarUrl: string | null;
  totalFinPoints: number;
  budget: number | null;
  level: number;
  role: "USER" | "ADMIN";
}

export interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserContext: (updatedData: Partial<User>) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        console.log("onAuthStateChanged: Logado - UID:", fbUser.uid);

        try {
          const response = await api.get(`/users/${fbUser.uid}`);
          const backendUser = response.data;

          const appUser: User = {
            uid: fbUser.uid,
            name: backendUser.name,
            email: backendUser.email,
            registrationDate: backendUser.registrationDate,
            avatarUrl: backendUser.avatarUrl || null,
            totalFinPoints: backendUser.totalFinPoints || 0,
            budget: backendUser.budget,
            level: backendUser.level || 1,
            role: backendUser.role || "USER",
          };

          if (import.meta.env.DEV) {
            const token = await fbUser.getIdToken();
            console.groupCollapsed(
              "%c[DEBUG] Token de Autenticação (para Postman)",
              "color: orange; font-weight: bold;"
            );
            console.log(token);
            console.groupEnd();
          }

          setUser(appUser);
          console.log("Usuário do backend carregado:", appUser);
        } catch (error) {
          console.error("Erro ao carregar usuário do backend:", error);
          setUser(null);
        }
      } else {
        console.log("onAuthStateChanged: Deslogado");
        setUser(null);
      }

      setIsLoading(false);
    });

    return () => {
      console.log("Desinscrevendo listener onAuthStateChanged");
      unsubscribe();
    };
  }, []);

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    console.log("Iniciando registro...");

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      const { uid } = response.data;
      console.log("Usuário criado no backend:", uid);

      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login automático realizado!");

    } catch (error: any) {
      console.error("❌ Erro no registro:", error);

      if (error.response?.status === 409) {
        throw new Error("Este email já está cadastrado.");
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else if (error.code === "auth/email-already-in-use") {
        throw new Error("Este email já está cadastrado.");
      } else if (error.code === "auth/invalid-email") {
        throw new Error("Email inválido.");
      } else if (error.code === "auth/weak-password") {
        throw new Error("Senha muito fraca (mínimo 6 caracteres).");
      } else {
        throw new Error("Erro ao criar conta. Tente novamente.");
      }
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    console.log("Tentando fazer login...");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login bem-sucedido!");
    } catch (error: any) {
      console.error("Erro no login:", error);

      if (error.code === "auth/user-not-found") {
        throw new Error("Usuário não encontrado.");
      } else if (error.code === "auth/wrong-password") {
        throw new Error("Senha incorreta.");
      } else if (error.code === "auth/invalid-email") {
        throw new Error("Email inválido.");
      } else if (error.code === "auth/too-many-requests") {
        throw new Error("Muitas tentativas. Tente novamente mais tarde.");
      } else {
        throw new Error("Erro ao fazer login. Tente novamente.");
      }
    }
  };

  const logout = async (): Promise<void> => {
    console.log("Fazendo logout...");
    try {
      await signOut(auth);
      console.log("Logout concluído!");
    } catch (error: any) {
      console.error("Erro no logout:", error);
      throw error;
    }
  };

  const updateUserContext = (updatedData: Partial<User>) => {
    setUser((prevUser) => {
      if (!prevUser) return null;
      const newUser = { ...prevUser, ...updatedData };
      console.log("Usuário atualizado:", newUser);
      return newUser;
    });
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    isAuthenticated: !!user,
    isLoading,
    register,
    login,
    logout,
    updateUserContext,
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
