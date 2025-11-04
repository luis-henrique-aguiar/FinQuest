import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, AlertCircle } from 'react-feather';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import * as S from './ForgotPasswordPage.styles';
import { useToast } from '../hooks/useToast'; 
import { InputGroup } from '../components/auth/InputGroup';
import Button from '../components/common/Button';

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
    <S.PageContainer>
      <S.FormContainer
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <S.FormHeader>
          <h2>Esqueceu sua senha?</h2>
          <p>Sem problemas! Digite seu email e enviaremos um link para você criar uma nova.</p>
        </S.FormHeader>

        <S.FormElement onSubmit={handleResetPassword} noValidate>
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
          />
          
          {error && <S.ErrorMessage role="alert"><AlertCircle size={14}/> {error}</S.ErrorMessage>}

          <Button
            type="submit"
            variant="primary"
            size="large"
            fullWidth
            icon={isLoading ? <S.Spinner /> : undefined}
            disabled={isLoading || !email}
          >
            {isLoading ? 'Enviando...' : 'Enviar Email de Redefinição'}
          </Button>

          <Button
            type="button"
            variant="text"
            onClick={() => navigate('/login')}
            icon={<ArrowLeft size={16} />}
          >
            Voltar para o Login
          </Button>
        </S.FormElement>
      </S.FormContainer>
    </S.PageContainer>
  );
};

export default ForgotPasswordPage;