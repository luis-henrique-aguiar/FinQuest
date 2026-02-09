import React from 'react';
import { Mail, Lock, ArrowRight, Eye, EyeOff, User } from 'react-feather';
import { motion } from 'framer-motion';
import mascotImage from '../assets/images/fox.png';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/features/auth/hooks/useLogin';

const LoginPage: React.FC = () => {
  const {
    form: {
      register,
      formState: { errors },
    },
    showPassword,
    isLoading,
    togglePasswordVisibility,
    onSubmit,
    navigate,
  } = useLogin();

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut' as const,
      repeatType: 'loop' as const,
    },
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative overflow-hidden bg-white dark:bg-zinc-950">
      {/* Background Shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-[400px] h-[400px] bg-[#007ACC] rounded-full blur-[100px] opacity-20 top-[20%] -left-[10%]"
          animate={{
            y: floatingAnimation.y,
            transition: floatingAnimation.transition,
          }}
        />
        <motion.div
          className="absolute w-[300px] h-[300px] bg-[#28A745] rounded-full blur-[100px] opacity-20 top-[60%] left-[80%]"
          animate={{
            y: floatingAnimation.y,
            transition: { ...floatingAnimation.transition, delay: 1 },
          }}
        />
      </div>

      {/* Left Side - Branding */}
      <div className="flex-1 bg-gradient-to-br from-[#007acc] to-[#28a745] flex flex-col items-center justify-center p-8 lg:p-16 relative text-white text-center rounded-b-[30px] lg:rounded-r-[30px] lg:rounded-bl-none z-10 lg:min-h-screen">
        <motion.div
          animate={{
            y: [0, -15, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] bg-white/15 backdrop-blur-xl rounded-full flex items-center justify-center p-4 border-[3px] border-white/30 mb-8 shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
        >
          <img
            src={mascotImage}
            alt="FinQuest Mascote"
            className="w-full h-full object-contain"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-[500px] relative z-10"
        >
          <h1 className="text-4xl lg:text-5xl font-bold mb-4 text-white drop-shadow-md">FinQuest</h1>
          <p className="text-lg lg:text-xl opacity-95 leading-relaxed mb-4">
            Transforme sua vida financeira em uma jornada épica de conquistas e
            aprendizado.
          </p>

          <div className="flex gap-8 lg:gap-12 mt-12 justify-center">
            <div className="text-center">
              <h3 className="text-3xl lg:text-4xl font-extrabold text-[#ffcc00] mb-1">+10k</h3>
              <p className="text-sm lg:text-base opacity-90">Usuários</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl lg:text-4xl font-extrabold text-[#ffcc00] mb-1">R$ 5M+</h3>
              <p className="text-sm lg:text-base opacity-90">Economizados</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 lg:p-16 bg-white dark:bg-zinc-950 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full max-w-md"
        >
          <div className="mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-2 text-zinc-800 dark:text-zinc-100">Bem-vindo de volta!</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">Faça login para continuar sua jornada.</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-[#FFCC00]/10 to-[#FD7E14]/10 border-l-4 border-[#ffcc00] p-4 rounded-xl mb-8 flex gap-4 items-start"
          >
            <User size={20} className="text-[#333] shrink-0 mt-[2px]" />
            <div>
              <h4 className="text-[#333] text-sm font-semibold mb-1">Conta de Demonstração</h4>
              <p className="text-sm text-zinc-500 m-0">Email: <strong className="text-[#333] font-mono bg-black/5 px-1.5 py-0.5 rounded text-xs">demo@finquest.com</strong></p>
              <p className="text-sm text-zinc-500 m-0">Senha: <strong className="text-[#333] font-mono bg-black/5 px-1.5 py-0.5 rounded text-xs">demo123</strong></p>
            </div>
          </motion.div>

          <form onSubmit={onSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative flex items-center">
                <Mail size={20} className="absolute left-4 text-zinc-400 pointer-events-none z-10" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-12 py-6 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 focus-visible:ring-0 focus-visible:border-[#007acc] transition-all bg-white dark:bg-zinc-900"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <div className="text-red-500 text-sm font-medium mt-1 flex items-center gap-1">
                  {errors.email.message}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative flex items-center">
                <Lock size={20} className="absolute left-4 text-zinc-400 pointer-events-none z-10" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Sua senha secreta"
                  className="pl-12 py-6 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 focus-visible:ring-0 focus-visible:border-[#007acc] transition-all bg-white dark:bg-zinc-900"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 text-zinc-400 hover:text-[#007acc] transition-colors bg-transparent border-none cursor-pointer flex items-center justify-center p-1 rounded-full focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <div className="text-red-500 text-sm font-medium mt-1 flex items-center gap-1">
                  {errors.password.message}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-[#007acc] text-sm font-semibold bg-transparent border-none p-0 cursor-pointer hover:underline hover:opacity-80 transition-all"
              >
                Esqueceu a senha?
              </button>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
              className="w-full py-4 text-lg font-bold font-['Poppins'] bg-gradient-to-br from-[#007acc] to-[#28a745] text-white border-none rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(0,122,204,0.3)] hover:shadow-[0_15px_40px_rgba(0,122,204,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Entrar <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>

          <div className="flex items-center gap-4 my-8 text-zinc-500 text-sm before:flex-1 before:h-px before:bg-zinc-200 dark:before:bg-zinc-800 after:flex-1 after:h-px after:bg-zinc-200 dark:after:bg-zinc-800">
            ou
          </div>

          <div className="text-center text-zinc-500 text-base">
            Não tem uma conta?{' '}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-[#007acc] font-semibold bg-transparent border-none p-0 cursor-pointer hover:underline hover:opacity-80 transition-all"
            >
              Crie agora gratuitamente
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
