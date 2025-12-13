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

export interface Achievement {
    achievementId: number;
    title: string;
    icon: string;
    unlockedDate: string;
}

export interface User {
  uid: string;
  name: string;
  email: string | null;
  registrationAt: string;
  avatarUrl: string | null;
  totalFinPoints: number;
  level: number;
  role: "USER" | "ADMIN";
  unlockedAchievements: Achievement[];
}

export interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserContext: (updatedData: Partial<User> & { unlockedBadge?: Achievement}) => void;
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
        try {
          const response = await api.get(`/users/${fbUser.uid}`);
          const backendUser = response.data;

          const appUser: User = {
            uid: fbUser.uid,
            name: backendUser.name,
            email: backendUser.email,
            registrationAt: backendUser.registrationAt,
            avatarUrl: backendUser.avatarUrl || null,
            totalFinPoints: backendUser.totalFinPoints || 0,
            level: backendUser.level || 1,
            role: backendUser.role || "USER",
            unlockedAchievements: backendUser.unlockedAchievements || [],
          };

          setUser(appUser);
        } catch (error) {
          console.error("Erro ao carregar usuário do backend:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }

      setIsLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      await signInWithEmailAndPassword(auth, email, password);

    } catch (error: any) {
      console.error("Erro no registro:", error);

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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      console.log("Firebase Auth OK. Verificando backend...");

      try {
        await api.get(`/users/${firebaseUser.uid}`);
        console.log("Backend User OK!");
        
      } catch (backendError: any) {
        console.error("Usuário não encontrado no backend. Fazendo logout do Firebase.");
        
        await signOut(auth); 
        
        if (backendError.response?.status === 404) {
           throw new Error("Inconsistência de dados: Usuário não encontrado no banco de dados.");
        } else {
           throw new Error("Erro ao conectar com o servidor. Tente novamente.");
        }
      }

    } catch (error: any) {
      console.error("Erro no processo de login:", error);

      if (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") {
        throw new Error("Email ou senha incorretos.");
      } else if (error.code === "auth/wrong-password") {
        throw new Error("Senha incorreta.");
      } else if (error.code === "auth/invalid-email") {
        throw new Error("Email inválido.");
      } else if (error.code === "auth/too-many-requests") {
        throw new Error("Muitas tentativas. Tente novamente mais tarde.");
      } else {
        throw error;
      }
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw error;
    }
  };

  const updateUserContext = (updatedData: Partial<User> & { unlockedBadge?: Achievement }) => {
    setUser((prevUser) => {
      if (!prevUser) return null;

      const newAchievement = updatedData.unlockedBadge;

      let mergedAchievements = prevUser.unlockedAchievements;
      const dataToMerge: Partial<User> = { ...updatedData };

      if (newAchievement) {
          mergedAchievements = [...prevUser.unlockedAchievements, newAchievement];
          delete (dataToMerge as any).unlockedBadge;
      }

      const newUser: User = {
          ...prevUser,
          ...dataToMerge,
          unlockedAchievements: mergedAchievements
      };

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
