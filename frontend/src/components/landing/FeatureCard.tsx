import React, { type ReactNode } from 'react';
import { motion } from 'framer-motion';


interface FeatureCardProps {
  icon: ReactNode;
  iconBgColor: string;
  title: string;
  text: string;
  delay: number;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ icon, iconBgColor, title, text, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay }}
      whileHover={{ scale: 1.02 }}
      className="bg-gradient-to-br from-[#007acc]/5 to-[#28a745]/5 rounded-3xl p-12 text-center relative overflow-hidden border-2 border-transparent hover:border-primary transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(0,122,204,0.2)] dark:from-[#007acc]/10 dark:to-[#28a745]/10"
    >
      {/* Top Border Gradient */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#007ACC] to-[#28A745]" />

      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-white shadow-lg"
        style={{
          backgroundColor: iconBgColor,
          boxShadow: `0 10px 30px ${iconBgColor}40`
        }}
      >
        {icon}
      </div>

      <h3 className="text-xl font-bold mb-4 text-zinc-900 dark:text-zinc-50">{title}</h3>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{text}</p>
    </motion.div>
  );
};