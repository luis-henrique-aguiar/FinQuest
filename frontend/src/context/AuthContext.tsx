import React, { createContext, useState, type ReactNode, useEffect } from 'react';
import {
  type User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase';

interface User {
  uid: string;
  email: string | null;
  name: string | null;
  avatarUrl?: string | null;
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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        console.log("onAuthStateChanged: Logado - UID:", fbUser.uid);
        const mappedUser: User = {
          uid: fbUser.uid,
          email: fbUser.email,
          name: fbUser.displayName,
          avatarUrl: fbUser.photoURL,
        };
        setUser(mappedUser);
      } else {
        console.log("onAuthStateChanged: Deslogado");
        setUser(null);
      }
      if (isLoading) {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, [isLoading]);

  const register = async (name: string, email: string, password: string): Promise<void> => {
    console.log('AuthContext: Tentando registrar com Firebase...', { name, email });
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: name });
        console.log('AuthContext: Perfil Firebase atualizado com nome.');
      }
      console.log('AuthContext: Registro Firebase bem-sucedido!');
    } catch (error: any) {
      console.error("Erro no registro Firebase:", error);
      throw error;
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    console.log('AuthContext: Tentando logar com Firebase...', { email });
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('AuthContext: Login Firebase bem-sucedido!');
    } catch (error: any) {
      console.error("Erro no login Firebase:", error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    console.log('AuthContext: Fazendo logout com Firebase...');
    try {
      await signOut(auth);
      console.log('AuthContext: Logout Firebase concluído.');
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
      // Pode retornar um componente de Spinner/Loading global aqui se preferir
      return null;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
