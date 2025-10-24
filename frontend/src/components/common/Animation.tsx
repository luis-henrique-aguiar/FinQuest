import React from 'react';
import Lottie from 'lottie-react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

interface AnimationProps {
  animationData: unknown;
  size?: number;
  loop?: boolean;
  className?: string;
}

const AnimationContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Animation: React.FC<AnimationProps> = ({
  animationData,
  size = 100,
  loop = true,
  className,
}) => {
  return (
    <AnimationContainer
      className={className}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Lottie
        animationData={animationData}
        loop={loop}
        style={{ width: size, height: size }}
      />
    </AnimationContainer>
  );
};

export default Animation;