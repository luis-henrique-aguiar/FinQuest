import React, {
  createContext,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import {
  type User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  deleteUser,
} from "firebase/auth";
import { auth } from "../firebase";
import FullScreenLoader from "../components/common/FullScreenLoader";
import api from "../services/api";
import { calculateLevel } from "../utils/levelingSystem";

export interface User {
  uid: string;
  name: string;
  email: string | null;
  avatarUrl: string | null;
  totalFinPoints: number;
  budget: number | null;
  level: number;
}

export interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  register: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
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
        if (isLoading) setIsLoading(true);

        try {
          const response = await api.get(`/users/${fbUser.uid}`);
          const backendUser = response.data;

          const userLevel = calculateLevel(backendUser.totalFinPoints);

          const appUser: User = {
            uid: fbUser.uid,
            name: backendUser.name,
            email: backendUser.email,
            avatarUrl: backendUser.avatarUrl || null,
            totalFinPoints: backendUser.totalFinPoints || 0,
            budget: backendUser.budget,
            level: userLevel,
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
          console.log(
            "AuthContext: Usuário completo do backend carregado.",
            appUser
          );
        } catch (error) {
          console.warn(
            "AuthContext: Usuário não encontrado no backend. Iniciando auto-correção..."
          );
          throw error;
        }
      } else {
        console.log("onAuthStateChanged: Deslogado");
        setUser(null);
      }

      setIsLoading(false);
    });

    return () => {
      console.log("AuthContext: Desinscrevendo listener onAuthStateChanged.");
      unsubscribe();
    };
  }, []);

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    console.log("AuthContext: 1. Registrando no Firebase...");
    let firebaseUser: FirebaseUser | null = null;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName: name });
      console.log("AuthContext: 2. Perfil Firebase atualizado com nome.");

      const registerBackendDTO = {
        id: firebaseUser.uid,
        email: firebaseUser.email,
        name: name,
      };

      console.log("AuthContext: 3. Sincronizando com o backend Spring...");
      await api.post("/users/auth/register", registerBackendDTO);
      console.log("AuthContext: 4. Usuário sincronizado com o backend.");
    } catch (error: any) {
      console.error("Erro no fluxo de registro:", error);
      if (firebaseUser) {
        console.warn(
          "Sincronização com backend falhou. Tentando reverter criação no Firebase..."
        );
        try {
          await deleteUser(firebaseUser);
          console.log("Rollback do Firebase concluído. Usuário deletado.");
        } catch (deleteError) {
          throw deleteError;
        }
      }
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    console.log("AuthContext: Tentando logar com Firebase...", { email });
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("AuthContext: Login Firebase bem-sucedido!");
    } catch (error: any) {
      console.error("Erro no login Firebase:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    console.log("AuthContext: Fazendo logout com Firebase...");
    try {
      await signOut(auth);
      console.log("AuthContext: Logout Firebase concluído.");
    } catch (error: any) {
      console.error("Erro no logout Firebase:", error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    isAuthenticated: !!user,
    isLoading,
    register,
    login,
    logout,
  };

  if (isLoading) {
    return <FullScreenLoader />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
