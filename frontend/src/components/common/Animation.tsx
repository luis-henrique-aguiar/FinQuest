import React from 'react';
import Lottie from 'lottie-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimationProps {
  animationData: unknown;
  size?: number;
  loop?: boolean;
  className?: string;
}

export const Animation: React.FC<AnimationProps> = ({
  animationData,
  size = 100,
  loop = true,
  className,
}) => {
  return (
    <motion.div
      className={cn("flex justify-center items-center", className)}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Lottie
        animationData={animationData}
        loop={loop}
        style={{ width: size, height: size }}
      />
    </motion.div>
  );
};

export default Animation;