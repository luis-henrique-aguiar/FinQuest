import React from "react";
import FoxLogo from "../../assets/images/fox.png";
import { motion } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";


export const TopBar: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num.toLocaleString('pt-BR');
  };

  return (
    <header className="sticky top-0 z-[100] h-[72px] flex items-center justify-between px-6 md:px-8 pl-[70px] md:pl-8 bg-white dark:bg-[#1E1E1E] border-b-2 border-zinc-200 dark:border-zinc-800 shadow-sm transition-colors duration-200">
      <div className="flex items-center gap-4">
        <motion.img
          src={FoxLogo}
          alt="FinQuest Fox Logo"
          className="h-10 w-auto drop-shadow-[0_2px_8px_rgba(0,122,204,0.25)] hover:drop-shadow-[0_4px_12px_rgba(0,122,204,0.4)] transition-[filter] duration-200"
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.05, 1.05, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            repeatDelay: 3,
          }}
        />
        <div className="hidden min-[480px]:flex flex-col gap-0.5">
          <h1 className="font-heading font-bold text-2xl text-zinc-800 dark:text-[#EAECEF] leading-none m-0">
            FinQuest
          </h1>
          <span className="font-body text-xs font-medium text-zinc-500 dark:text-[#AAB1B8]">
            Educação Financeira Gamificada
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2 bg-white dark:bg-[#1E1E1E] border-2 border-zinc-200 dark:border-zinc-700 rounded-full transition-all duration-200 cursor-default hover:border-[#007ACC] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,122,204,0.15)]"
        >
          <span className="text-xl md:text-2xl leading-none drop-shadow-sm filter">💎</span>
          <span className="font-heading font-bold text-base md:text-lg text-zinc-800 dark:text-[#EAECEF] leading-none">
            {formatNumber(user.totalFinPoints)}
          </span>
        </motion.div>
      </div>
    </header>
  );
};

export default TopBar;