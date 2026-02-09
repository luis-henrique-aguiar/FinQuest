import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/auth-store';
import { registerSchema, type RegisterSchema } from '@/features/auth/schemas/auth-schema';

export const useRegister = () => {
    const navigate = useNavigate();
    const registerUser = useAuthStore((state) => state.register);
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);

    const form = useForm<RegisterSchema>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        },
    });

    const { watch, handleSubmit } = form;
    const password = watch('password');

    useEffect(() => {
        if (password) {
            calculatePasswordStrength(password);
        } else {
            setPasswordStrength(0);
        }
    }, [password]);

    const calculatePasswordStrength = (pass: string) => {
        let strength = 0;
        if (pass.length >= 6) strength++;
        if (pass.length >= 10) strength++;
        if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength++;
        if (/\d/.test(pass)) strength++;
        if (/[^a-zA-Z0-9]/.test(pass)) strength++;
        setPasswordStrength(Math.min(strength, 4));
    };

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    const onSubmit = async (data: RegisterSchema) => {
        try {
            await registerUser(data.email, data.password, data.name);
            toast.success('Conta criada com sucesso! Bem-vindo ao FinQuest.');
            navigate('/home');
        } catch (error: any) {
            console.error('Erro no registro:', error);
            let msg = 'Ocorreu um erro inesperado. Tente novamente.';

            if (error?.code) {
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        msg = 'Este email já está sendo usado.';
                        break;
                    case 'auth/invalid-email':
                        msg = 'O formato do email é inválido.';
                        break;
                    case 'auth/weak-password':
                        msg = 'A senha é muito fraca.';
                        break;
                    default:
                        msg = 'Erro ao criar conta. Tente novamente.';
                }
            }
            toast.error(msg);
        }
    };

    return {
        form,
        showPassword,
        passwordStrength,
        password,
        togglePasswordVisibility,
        onSubmit: handleSubmit(onSubmit),
        navigate,
    };
};
