import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle } from 'react-feather';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { useToast } from '../hooks/useToast';
import { InputGroup } from '../components/auth/InputGroup';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const ForgotPasswordPage: React.FC = () => {
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

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[450px] bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl"
      >
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2 text-zinc-800 dark:text-zinc-100">Esqueceu sua senha?</h2>
          <p className="text-base text-zinc-500 dark:text-zinc-400 m-0">
            Sem problemas! Digite seu email e enviaremos um link para você criar uma nova.
          </p>
        </div>

        <form onSubmit={handleResetPassword} noValidate className="flex flex-col gap-6">
          <InputGroup
            id="email"
            label="Email"
            icon={<Mail size={20} />}
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-invalid={!!error}
            containerClassName="w-full"
            className="w-full"
          />

          {error && (
            <div role="alert" className="text-red-500 text-sm font-medium flex items-center gap-1.5 bg-red-500/10 p-3 rounded-lg">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <Button
              type="submit"
              disabled={isLoading || !email}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[#007ACC] to-[#28A745] hover:opacity-90 text-white rounded-xl shadow-lg shadow-blue-500/20"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Enviando...
                </>
              ) : 'Enviar Email de Redefinição'}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/login')}
              className="w-full h-10 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <ArrowLeft size={16} className="mr-2" />
              Voltar para o Login
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;