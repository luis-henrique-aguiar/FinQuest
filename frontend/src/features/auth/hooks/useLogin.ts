import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth-store';
import { loginSchema, type LoginSchema } from '@/features/auth/schemas/auth-schema';

export const useLogin = () => {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    const onSubmit = async (data: LoginSchema) => {
        setIsLoading(true);
        try {
            await login(data.email, data.password);
            toast.success('Bem-vindo(a) de volta!');
            navigate('/home');
        } catch (error: any) {
            console.error('Erro no login:', error);
            let msg = 'Ocorreu um erro inesperado. Tente novamente.';

            if (error?.code) {
                switch (error.code) {
                    case 'auth/invalid-credential':
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                        msg = 'Email ou senha incorretos.';
                        break;
                    case 'auth/invalid-email':
                        msg = 'O formato do email é inválido.';
                        break;
                    case 'auth/too-many-requests':
                        msg = 'Muitas tentativas. Aguarde alguns instantes.';
                        break;
                    default:
                        msg = 'Erro ao autenticar. Tente novamente.';
                }
            }
            toast.error(msg);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        form,
        showPassword,
        isLoading,
        togglePasswordVisibility,
        onSubmit: form.handleSubmit(onSubmit),
        navigate,
    };
};
