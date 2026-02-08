import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Theme Store
 * 
 * Manages light/dark mode state globally using Zustand.
 * Replaces the old ThemeContext.
 */

type ThemeMode = 'light' | 'dark';

interface ThemeState {
    mode: ThemeMode;
    toggleTheme: () => void;
    setTheme: (mode: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            mode: 'light',

            toggleTheme: () =>
                set((state) => ({
                    mode: state.mode === 'light' ? 'dark' : 'light',
                })),

            setTheme: (mode) =>
                set({ mode }),
        }),
        {
            name: 'finquest-theme', // localStorage key
        }
    )
);

// Apply theme to document on store changes
useThemeStore.subscribe((state) => {
    if (state.mode === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
});

// Initialize theme on load
const initialMode = useThemeStore.getState().mode;
if (initialMode === 'dark') {
    document.documentElement.classList.add('dark');
}
