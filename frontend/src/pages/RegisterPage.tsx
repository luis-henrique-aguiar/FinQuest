import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Check,
  AlertCircle,
  Eye,
  EyeOff,
} from 'react-feather';
import { motion } from 'framer-motion';
import mascotImage from '../assets/images/fox.png';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useRegister } from '@/features/auth/hooks/useRegister';

const RegisterPage = () => {
  const {
    form: {
      register,
      formState: { errors, isSubmitting },
    },
    showPassword,
    passwordStrength,
    password,
    togglePasswordVisibility,
    onSubmit,
    navigate,
  } = useRegister();

  const benefits = [
    {
      title: 'Controle Total',
      description: 'Gerencie receitas, despesas e investimentos em um só lugar.',
    },
    {
      title: 'Gamificação',
      description: 'Ganhe XP e conquistas ao atingir suas metas financeiras.',
    },
    {
      title: 'Planejamento',
      description: 'Defina objetivos e acompanhe sua evolução mensal.',
    },
  ];

  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut' as const,
      repeatType: 'loop' as const,
    },
  };

  const getStrengthColor = (strength: number) => {
    if (strength <= 1) return "bg-red-500 text-red-500";
    if (strength <= 2) return "bg-orange-500 text-orange-500";
    if (strength <= 3) return "bg-yellow-400 text-yellow-400";
    return "bg-green-500 text-green-500";
  };

  const getStrengthText = (strength: number) => {
    if (strength <= 1) return "Muito fraca";
    if (strength <= 2) return "Fraca";
    if (strength <= 3) return "Média";
    if (strength <= 4) return "Forte";
    return "Muito forte";
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative overflow-hidden bg-white dark:bg-zinc-950">
      {/* Background Shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-[400px] h-[400px] bg-[#28A745] rounded-full blur-[100px] opacity-20 -top-[10%] -left-[10%]"
          animate={{
            y: floatingAnimation.y,
            transition: floatingAnimation.transition,
          }}
        />
        <motion.div
          className="absolute w-[300px] h-[300px] bg-[#007ACC] rounded-full blur-[100px] opacity-20 top-[50%] left-[80%]"
          animate={{
            y: floatingAnimation.y,
            transition: { ...floatingAnimation.transition, delay: 1 },
          }}
        />
      </div>

      {/* Left Side - Branding */}
      <div className="flex-1 bg-gradient-to-br from-[#28a745] to-[#007acc] flex flex-col items-center justify-center p-8 lg:p-16 relative text-white text-center rounded-b-[30px] lg:rounded-r-[30px] lg:rounded-bl-none z-10 lg:min-h-screen">
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
          className="w-[120px] h-[120px] lg:w-[200px] lg:h-[200px] bg-white/15 backdrop-blur-xl rounded-full flex items-center justify-center p-4 border-[3px] border-white/30 mb-8 shadow-[0_20px_60px_rgba(0,0,0,0.2)]"
        >
          <img
            src={mascotImage}
            alt="FinQuest Mascote"
            className="w-full h-full object-contain"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-[500px] relative z-10"
        >
          <h1 className="text-3xl lg:text-5xl font-bold mb-4 text-white drop-shadow-md">Junte-se à Quest!</h1>
          <p className="text-lg lg:text-xl opacity-95 leading-relaxed mb-12">
            Crie sua conta e comece sua jornada rumo à independência financeira.
          </p>

          <div className="flex flex-col gap-6 text-left max-w-[400px] mx-auto">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 lg:px-6 rounded-xl border border-white/20"
              >
                <Check size={24} className="shrink-0 text-[#ffcc00]" />
                <div>
                  <h4 className="text-base font-bold text-white mb-1">{benefit.title}</h4>
                  <p className="text-sm opacity-90 m-0">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
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
            <h2 className="text-3xl lg:text-4xl font-bold mb-2 text-zinc-800 dark:text-zinc-100">Crie sua conta</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">Preencha os dados abaixo para começar.</p>
          </div>

          <form onSubmit={onSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Nome Completo</Label>
              <div className="relative flex items-center">
                <User size={20} className="absolute left-4 text-zinc-400 pointer-events-none z-10" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Seu nome"
                  className="pl-12 py-6 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 focus-visible:ring-0 focus-visible:border-[#28a745] transition-all bg-white dark:bg-zinc-900"
                  {...register('name')}
                />
              </div>
              {errors.name && (
                <div className="text-red-500 text-sm font-medium mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.name.message}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative flex items-center">
                <Mail size={20} className="absolute left-4 text-zinc-400 pointer-events-none z-10" />
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  className="pl-12 py-6 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 focus-visible:ring-0 focus-visible:border-[#28a745] transition-all bg-white dark:bg-zinc-900"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <div className="text-red-500 text-sm font-medium mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.email.message}
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
                  placeholder="Crie uma senha forte"
                  className="pl-12 py-6 pr-14 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 focus-visible:ring-0 focus-visible:border-[#28a745] transition-all bg-white dark:bg-zinc-900"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-4 text-zinc-400 hover:text-[#28a745] transition-colors bg-transparent border-none cursor-pointer flex items-center justify-center p-1 rounded-full focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              {password && (
                <>
                  <div className="flex gap-1 mt-2 h-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className={cn(
                          "flex-1 rounded-full transition-all duration-300",
                          passwordStrength >= level ? getStrengthColor(passwordStrength).split(" ")[0] : "bg-zinc-200 dark:bg-zinc-800"
                        )}
                      />
                    ))}
                  </div>
                  <div className={cn("text-xs font-medium mt-1", getStrengthColor(passwordStrength).split(" ")[1])}>
                    {getStrengthText(passwordStrength)}
                  </div>
                </>
              )}

              {errors.password && (
                <div className="text-red-500 text-sm font-medium mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.password.message}
                </div>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="confirmPassword">Confirmar Senha</Label>
              <div className="relative flex items-center">
                <Lock size={20} className="absolute left-4 text-zinc-400 pointer-events-none z-10" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Repita sua senha"
                  className="pl-12 py-6 rounded-xl border-2 border-zinc-200 dark:border-zinc-800 focus-visible:ring-0 focus-visible:border-[#28a745] transition-all bg-white dark:bg-zinc-900"
                  {...register('confirmPassword')}
                />
              </div>
              {errors.confirmPassword && (
                <div className="text-red-500 text-sm font-medium mt-1 flex items-center gap-1">
                  <AlertCircle size={14} /> {errors.confirmPassword.message}
                </div>
              )}
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isSubmitting}
              className="w-full py-4 text-lg font-bold font-['Poppins'] bg-gradient-to-br from-[#28a745] to-[#007acc] text-white border-none rounded-xl cursor-pointer flex items-center justify-center gap-2 shadow-[0_10px_30px_rgba(40,167,69,0.3)] hover:shadow-[0_15px_40px_rgba(40,167,69,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none mt-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Criando conta...
                </>
              ) : (
                <>
                  Criar Conta <ArrowRight size={20} />
                </>
              )}
            </motion.button>
          </form>

          <div className="flex items-center gap-4 my-8 text-zinc-500 text-sm before:flex-1 before:h-px before:bg-zinc-200 dark:before:bg-zinc-800 after:flex-1 after:h-px after:bg-zinc-200 dark:after:bg-zinc-800">
            ou
          </div>

          <div className="text-center text-zinc-500 text-base">
            Já tem uma conta?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-[#007acc] font-semibold bg-transparent border-none p-0 cursor-pointer hover:underline hover:opacity-80 transition-all"
            >
              Faça login
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
