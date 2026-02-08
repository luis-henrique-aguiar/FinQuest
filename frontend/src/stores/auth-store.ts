import { create } from 'zustand';
import {
    type User as FirebaseUser,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase';
import api from '../services/api';

/**
 * Auth Store
 * 
 * Manages authentication state globally using Zustand.
 * Replaces the old AuthContext.
 */

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
    role: 'USER' | 'ADMIN';
    unlockedAchievements: Achievement[];
}

interface AuthState {
    user: User | null;
    firebaseUser: FirebaseUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setFirebaseUser: (fbUser: FirebaseUser | null) => void;
    setLoading: (loading: boolean) => void;
    register: (name: string, email: string, password: string) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (updatedData: Partial<User> & { unlockedBadge?: Achievement }) => void;
    fetchUserData: (uid: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    firebaseUser: null,
    isLoading: true,
    isAuthenticated: false,

    setUser: (user) =>
        set({ user, isAuthenticated: !!user }),

    setFirebaseUser: (fbUser) =>
        set({ firebaseUser: fbUser }),

    setLoading: (loading) =>
        set({ isLoading: loading }),

    fetchUserData: async (uid: string) => {
        try {
            const response = await api.get(`/users/${uid}`);
            const backendUser = response.data;

            const appUser: User = {
                uid,
                name: backendUser.name,
                email: backendUser.email,
                registrationAt: backendUser.registrationAt,
                avatarUrl: backendUser.avatarUrl || null,
                totalFinPoints: backendUser.totalFinPoints || 0,
                level: backendUser.level || 1,
                role: backendUser.role || 'USER',
                unlockedAchievements: backendUser.unlockedAchievements || [],
            };

            get().setUser(appUser);
        } catch (error) {
            console.error('Erro ao carregar usuário do backend:', error);
            get().setUser(null);
            throw error;
        }
    },

    register: async (name: string, email: string, password: string) => {
        try {
            await api.post('/auth/register', {
                name,
                email,
                password,
            });

            await signInWithEmailAndPassword(auth, email, password);
        } catch (error: any) {
            console.error('Erro no registro:', error);

            if (error.response?.status === 409) {
                throw new Error('Este email já está cadastrado.');
            } else if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            } else if (error.code === 'auth/email-already-in-use') {
                throw new Error('Este email já está cadastrado.');
            } else if (error.code === 'auth/invalid-email') {
                throw new Error('Email inválido.');
            } else if (error.code === 'auth/weak-password') {
                throw new Error('Senha muito fraca (mínimo 6 caracteres).');
            } else {
                throw new Error('Erro ao criar conta. Tente novamente.');
            }
        }
    },

    login: async (email: string, password: string) => {
        console.log('Tentando fazer login...');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const firebaseUser = userCredential.user;

            console.log('Firebase Auth OK. Verificando backend...');

            try {
                await get().fetchUserData(firebaseUser.uid);
                console.log('Backend User OK!');
            } catch (backendError: any) {
                console.error('Usuário não encontrado no backend. Fazendo logout do Firebase.');

                await signOut(auth);

                if (backendError.response?.status === 404) {
                    throw new Error('Inconsistência de dados: Usuário não encontrado no banco de dados.');
                } else {
                    throw new Error('Erro ao conectar com o servidor. Tente novamente.');
                }
            }
        } catch (error: any) {
            console.error('Erro no processo de login:', error);

            if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
                throw new Error('Email ou senha incorretos.');
            } else if (error.code === 'auth/wrong-password') {
                throw new Error('Senha incorreta.');
            } else if (error.code === 'auth/invalid-email') {
                throw new Error('Email inválido.');
            } else if (error.code === 'auth/too-many-requests') {
                throw new Error('Muitas tentativas. Tente novamente mais tarde.');
            } else {
                throw error;
            }
        }
    },

    logout: async () => {
        try {
            await signOut(auth);
            set({ user: null, firebaseUser: null, isAuthenticated: false });
        } catch (error: any) {
            throw error;
        }
    },

    updateUser: (updatedData: Partial<User> & { unlockedBadge?: Achievement }) => {
        set((state) => {
            if (!state.user) return state;

            const newAchievement = updatedData.unlockedBadge;
            let mergedAchievements = state.user.unlockedAchievements;
            const dataToMerge: Partial<User> = { ...updatedData };

            if (newAchievement) {
                mergedAchievements = [...state.user.unlockedAchievements, newAchievement];
                delete (dataToMerge as any).unlockedBadge;
            }

            const newUser: User = {
                ...state.user,
                ...dataToMerge,
                unlockedAchievements: mergedAchievements,
            };

            return { user: newUser };
        });
    },
}));

// Initialize Firebase Auth listener
onAuthStateChanged(auth, async (fbUser) => {
    const store = useAuthStore.getState();
    store.setFirebaseUser(fbUser);

    if (fbUser) {
        try {
            await store.fetchUserData(fbUser.uid);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    } else {
        store.setUser(null);
    }

    store.setLoading(false);
});
