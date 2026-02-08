import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'react-feather';
import { cn } from '@/lib/utils';

interface ContentSectionProps {
  title: string;
  titleHighlight?: string;
  text1: string;
  text2?: string;
  visualContent: string;
  visualVariant?: 'learning' | 'goals' | 'simulator';
  features?: string[];
  miniCards?: Array<{ icon: React.ReactNode; text: string; value?: string; position: string }>;
  ctaText?: string;
  reverse?: boolean;
  bg?: string;
}

export const ContentSection: React.FC<ContentSectionProps> = ({
  title,
  titleHighlight,
  text1,
  text2,
  visualContent,
  visualVariant = 'learning',
  features = [],
  miniCards = [],
  ctaText,
  reverse = false,
  bg,
}) => {
  const getVisualGradient = () => {
    switch (visualVariant) {
      case 'learning': return 'from-[rgba(0,122,204,0.1)] to-[rgba(40,167,69,0.1)] border-[rgba(0,122,204,0.2)]';
      case 'goals': return 'from-[rgba(255,204,0,0.1)] to-[rgba(253,126,20,0.1)] border-[rgba(255,204,0,0.2)]';
      case 'simulator': return 'from-[rgba(40,167,69,0.1)] to-[rgba(0,122,204,0.1)] border-[rgba(40,167,69,0.2)]';
      default: return 'from-[rgba(0,122,204,0.1)] to-[rgba(40,167,69,0.1)] border-[rgba(0,122,204,0.2)]';
    }
  };

  const getRotatingGradient = () => {
    switch (visualVariant) {
      case 'learning': return 'conic-gradient(from 0deg, transparent, rgba(0, 122, 204, 0.2), transparent)';
      case 'goals': return 'conic-gradient(from 0deg, transparent, rgba(255, 204, 0, 0.2), transparent)';
      case 'simulator': return 'conic-gradient(from 0deg, transparent, rgba(40, 167, 69, 0.2), transparent)';
      default: return 'conic-gradient(from 0deg, transparent, rgba(0, 122, 204, 0.2), transparent)';
    }
  };

  const getMiniCardPosition = (position: string) => {
    switch (position) {
      case 'top-left': return 'top-[10%] -left-[5%]';
      case 'top-right': return 'top-[15%] -right-[5%]';
      case 'bottom-left': return 'bottom-[15%] -left-[5%]';
      case 'bottom-right': return 'bottom-[10%] -right-[5%]';
      default: return '';
    }
  };

  return (
    <section
      className={cn(
        "py-16 md:py-32 px-4 md:px-8 relative overflow-hidden",
        bg ? "" : "bg-[#F8F9FA] dark:bg-zinc-900"
      )}
      style={bg ? { background: bg } : {}}
    >
      {/* Decorative Blob */}
      <div
        className={cn(
          "absolute w-[600px] h-[600px] rounded-full blur-[80px] opacity-60 pointer-events-none top-1/2 -translate-y-1/2",
          reverse ? "-left-[200px]" : "-right-[200px]",
          "bg-gradient-to-br from-[#007acc]/5 to-[#28a745]/5 dark:from-[#007acc]/10 dark:to-[#28a745]/10"
        )}
      />

      <div className={cn(
        "max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10",
      )}>
        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0, x: reverse ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={cn("flex flex-col", reverse && "lg:order-2")}
        >
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6 leading-[1.2] text-zinc-900 dark:text-zinc-50">
            {titleHighlight ? (
              <>
                {title.split(titleHighlight)[0]}
                <span className="bg-gradient-to-br from-[#007ACC] to-[#28A745] bg-clip-text text-transparent">
                  {titleHighlight}
                </span>
                {title.split(titleHighlight)[1]}
              </>
            ) : (
              title
            )}
          </h2>

          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
            {text1}
          </p>
          {text2 && (
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 leading-relaxed mb-10">
              {text2}
            </p>
          )}

          {features.length > 0 && (
            <div className="flex flex-col gap-4 mt-2">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-4 p-4 md:px-6 bg-white dark:bg-zinc-800 rounded-xl shadow-sm hover:shadow-md hover:translate-x-2 transition-all duration-300"
                >
                  <Star size={20} className="text-[#28A745] shrink-0 fill-[#28A745]" />
                  <span className="text-base font-medium text-zinc-800 dark:text-zinc-200">{feature}</span>
                </motion.div>
              ))}
            </div>
          )}

          {ctaText && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => alert('Navegando para a funcionalidade...')}
              className="mt-8 px-8 py-4 text-base font-semibold font-['Poppins'] bg-gradient-to-br from-[#007ACC] to-[#28A745] text-white rounded-xl inline-flex items-center gap-2 shadow-lg shadow-[#007acc]/30 hover:shadow-[#007acc]/40 transition-all self-start"
            >
              {ctaText}
              <ArrowRight size={18} />
            </motion.button>
          )}
        </motion.div>

        {/* Visual Content */}
        <motion.div
          initial={{ opacity: 0, x: reverse ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={cn("relative flex items-center justify-center", reverse && "lg:order-1")}
        >
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300 }}
            className={cn(
              "w-full max-w-[500px] aspect-square rounded-[40px] flex flex-col items-center justify-center text-[120px] md:text-[180px] relative overflow-hidden bg-gradient-to-br border-[3px] shadow-[0_20px_60px_rgba(0,0,0,0.1)]",
              getVisualGradient()
            )}
          >
            {/* Rotating Gradient Background */}
            <div
              className="absolute inset-[-50%] w-[200%] h-[200%] animate-[spin_6s_linear_infinite]"
              style={{ background: getRotatingGradient() }}
            />

            {/* Emoji */}
            <div className="relative z-10 animate-[float_3s_ease-in-out_infinite]">
              {visualContent}
            </div>
          </motion.div>

          {/* Floating Mini Cards */}
          {miniCards.map((card, index) => (
            <motion.div
              key={index}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.5,
              }}
              className={cn(
                "hidden md:flex absolute bg-white dark:bg-zinc-800 rounded-2xl p-4 md:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.15)] items-center gap-3 text-sm md:text-base font-semibold text-zinc-800 dark:text-zinc-100 z-20",
                getMiniCardPosition(card.position)
              )}
            >
              <div className="text-[#007ACC]">{card.icon}</div>
              <div className="flex flex-col">
                <span>{card.text}</span>
                {card.value && <span className="text-[#28A745] font-bold">{card.value}</span>}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};