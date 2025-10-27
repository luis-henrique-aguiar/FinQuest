import { motion } from "framer-motion";
import styled from "styled-components";

export const PageContainer = styled.div`
  width: 100%;
  overflow-x: hidden;
  position: relative;
`;

export const BackgroundShapes = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
`;

export const FloatingShape = styled(motion.div)<{
  $color: string;
  $size: number;
  $top: string;
  $left: string;
}>`
  position: absolute;
  width: ${(props) => props.$size}px;
  height: ${(props) => props.$size}px;
  background: ${(props) => props.$color};
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.3;
  top: ${(props) => props.$top};
  left: ${(props) => props.$left};
`;

// ============= HERO SECTION =============
export const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  background: linear-gradient(135deg, #007acc 0%, #28a745 100%);
  overflow: hidden;

  @media (max-width: 768px) {
    min-height: 90vh;
    padding: 1rem;
  }
`;

export const HeroContent = styled.div`
  max-width: 1200px;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  z-index: 1;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
`;

export const HeroText = styled.div`
  color: white;

  h1 {
    font-size: 4rem;
    font-weight: 800;
    margin-bottom: 1.5rem;
    line-height: 1.1;
    color: white;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

    span {
      background: linear-gradient(135deg, #ffcc00 0%, #fd7e14 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }

  p {
    font-size: 1.3rem;
    margin-bottom: 2.5rem;
    opacity: 0.95;
    line-height: 1.6;

    @media (max-width: 768px) {
      font-size: 1.1rem;
    }
  }
`;

export const CTAButton = styled(motion.button)`
  padding: 1.2rem 3rem;
  font-size: 1.2rem;
  font-weight: 700;
  font-family: "Poppins", sans-serif;
  background: linear-gradient(135deg, #ffcc00 0%, #fd7e14 100%);
  color: #333;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 10px 40px rgba(255, 204, 0, 0.4);
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 50px rgba(255, 204, 0, 0.6);
  }

  @media (max-width: 768px) {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
`;

export const HeroVisual = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 968px) {
    order: -1;
  }
`;

export const FloatingCard = styled(motion.div)<{ $delay: number }>`
  position: absolute;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  color: white;

  @media (max-width: 768px) {
    padding: 1rem;
    font-size: 0.9rem;
  }
`;

export const MascotContainer = styled(motion.div)`
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 150px;
  border: 3px solid rgba(255, 255, 255, 0.3);

  @media (max-width: 768px) {
    width: 200px;
    height: 200px;
    font-size: 100px;
  }
`;

// ============= FEATURES SECTION =============
export const FeaturesSection = styled.section`
  padding: 8rem 2rem;
  background: ${({ theme }) => theme.colors.white};
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 4rem 1rem;
  }
`;

export const SectionTitle = styled(motion.h2)`
  text-align: center;
  font-size: 3rem;
  margin-bottom: 4rem;
  color: ${({ theme }) => theme.colors.textDark};

  span {
    background: linear-gradient(135deg, #007acc 0%, #28a745 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 2rem;
  }
`;

export const FeaturesGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

// ============= STATS SECTION =============
export const StatsSection = styled.section`
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #007acc 0%, #28a745 100%);
  color: white;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 3rem 1rem;
  }
`;

export const StatsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 4rem;
  text-align: center;

  @media (max-width: 768px) {
    gap: 2rem;
  }
`;

export const StatItem = styled(motion.div)`
  h3 {
    font-size: 4rem;
    margin-bottom: 0.5rem;
    color: #ffcc00;
    font-weight: 800;

    @media (max-width: 768px) {
      font-size: 2.5rem;
    }
  }

  p {
    font-size: 1.2rem;
    opacity: 0.9;
    margin: 0;
  }
`;

// ============= FINAL CTA SECTION =============
export const FinalCTA = styled.section`
  padding: 8rem 2rem;
  background: ${({ theme }) => theme.colors.white};
  text-align: center;
  position: relative;
  z-index: 1;

  @media (max-width: 768px) {
    padding: 4rem 1rem;
  }
`;

export const CTAContent = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;

  h2 {
    font-size: 3.5rem;
    margin-bottom: 1.5rem;
    line-height: 1.2;

    @media (max-width: 768px) {
      font-size: 2rem;
    }
  }

  p {
    font-size: 1.3rem;
    color: ${({ theme }) => theme.colors.textMedium};
    margin-bottom: 3rem;
  }
`;
