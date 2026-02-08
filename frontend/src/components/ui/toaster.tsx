import { Toaster as Sonner } from 'sonner';
import { useThemeStore } from '@/stores/theme-store';

/**
 * Toast Component
 * 
 * Wrapper around Sonner that integrates with our theme system.
 * This replaces the old ToastContext visualization.
 */

export function Toaster() {
    const { mode } = useThemeStore();

    return (
        <Sonner
            theme={mode}
            position="top-right"
            richColors
            closeButton
            toastOptions={{
                classNames: {
                    toast: 'font-body',
                    title: 'font-semibold',
                    description: 'text-sm',
                    actionButton: 'bg-primary text-primary-foreground',
                    cancelButton: 'bg-muted text-muted-foreground',
                    error: 'bg-error text-white',
                    success: 'bg-success text-white',
                    warning: 'bg-warning text-white',
                    info: 'bg-info text-white',
                },
            }}
        />
    );
}
