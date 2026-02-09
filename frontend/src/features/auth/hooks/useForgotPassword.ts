import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/firebase';
import { useToast } from '@/hooks/useToast';

export const useForgotPassword = () => {
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        if (!email) {
            setError("Por favor, informe seu email.");
            return;
        }

        setIsLoading(true);

        try {
            await sendPasswordResetEmail(auth, email);

            addToast("Email de redefinição enviado! Verifique sua caixa de entrada.", "success");
            navigate('/login');

        } catch (error: any) {
            console.error("Erro ao enviar email de redefinição:", error);
            let errorMessage = "Ocorreu um erro. Tente novamente.";
            if (error.code === 'auth/user-not-found') {
                errorMessage = "Nenhuma conta encontrada com este email.";
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = "O email informado é inválido.";
            }
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        email,
        setEmail,
        isLoading,
        error,
        handleResetPassword,
        navigate,
    };
};
