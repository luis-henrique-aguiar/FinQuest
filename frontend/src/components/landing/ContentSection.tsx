import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowRight, Star } from 'react-feather';

const ContentSectionWrapper = styled.section<{ $reverse?: boolean; $bg?: string }>`
  padding: 8rem 2rem;
  background: ${props => props.$bg || '#F8F9FA'};
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 4rem 1rem;
  }

  /* Decorative elements */
  &::before {
    content: '';
    position: absolute;
    width: 600px;
    height: 600px;
    background: linear-gradient(135deg, rgba(0, 122, 204, 0.05), rgba(40, 167, 69, 0.05));
    border-radius: 50%;
    ${props => props.$reverse ? 'left: -200px;' : 'right: -200px;'}
    top: 50%;
    transform: translateY(-50%);
    filter: blur(80px);
  }
`;

const ContentGrid = styled.div<{ $reverse?: boolean }>`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6rem;
  align-items: center;
  position: relative;
  z-index: 1;

  @media (max-width: 968px) {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  ${props => props.$reverse && `
    direction: rtl;
    > * {
      direction: ltr;
    }
  `}
`;

const ContentText = styled(motion.div)`
  h2 {
    font-size: 3rem;
    margin-bottom: 1.5rem;
    line-height: 1.2;
    color: #333333;
    font-weight: 800;

    @media (max-width: 768px) {
      font-size: 2.2rem;
    }

    /* Gradient text for key words */
    .highlight {
      background: linear-gradient(135deg, #007ACC 0%, #28A745 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  p {
    font-size: 1.2rem;
    color: #6C757D;
    line-height: 1.8;
    margin-bottom: 1.5rem;

    &:last-of-type {
      margin-bottom: 2.5rem;
    }
  }
`;

const CTALink = styled(motion.button)`
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #007ACC 0%, #28A745 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 8px 24px rgba(0, 122, 204, 0.3);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 32px rgba(0, 122, 204, 0.4);
  }
`;

const ContentVisual = styled(motion.div)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const VisualBox = styled(motion.div)<{ $variant?: string }>`
  width: 100%;
  max-width: 500px;
  aspect-ratio: 1;
  background: ${props => {
    if (props.$variant === 'learning') return 'linear-gradient(135deg, rgba(0, 122, 204, 0.1), rgba(40, 167, 69, 0.1))';
    if (props.$variant === 'goals') return 'linear-gradient(135deg, rgba(255, 204, 0, 0.1), rgba(253, 126, 20, 0.1))';
    if (props.$variant === 'simulator') return 'linear-gradient(135deg, rgba(40, 167, 69, 0.1), rgba(0, 122, 204, 0.1))';
    return 'linear-gradient(135deg, rgba(0, 122, 204, 0.1), rgba(40, 167, 69, 0.1))';
  }};
  border-radius: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 180px;
  position: relative;
  overflow: hidden;
  border: 3px solid ${props => {
    if (props.$variant === 'learning') return 'rgba(0, 122, 204, 0.2)';
    if (props.$variant === 'goals') return 'rgba(255, 204, 0, 0.2)';
    if (props.$variant === 'simulator') return 'rgba(40, 167, 69, 0.2)';
    return 'rgba(0, 122, 204, 0.2)';
  }};
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: 120px;
  }

  /* Rotating gradient background */
  &::before {
    content: '';
    position: absolute;
    width: 200%;
    height: 200%;
    background: ${props => {
      if (props.$variant === 'learning') return 'conic-gradient(from 0deg, transparent, rgba(0, 122, 204, 0.2), transparent)';
      if (props.$variant === 'goals') return 'conic-gradient(from 0deg, transparent, rgba(255, 204, 0, 0.2), transparent)';
      if (props.$variant === 'simulator') return 'conic-gradient(from 0deg, transparent, rgba(40, 167, 69, 0.2), transparent)';
      return 'conic-gradient(from 0deg, transparent, rgba(0, 122, 204, 0.2), transparent)';
    }};
    animation: rotate 6s linear infinite;
  }

  @keyframes rotate {
    to { transform: rotate(360deg); }
  }
`;

// Floating mini cards around the visual
const FloatingMiniCard = styled(motion.div)<{ $position: string }>`
  position: absolute;
  background: white;
  border-radius: 16px;
  padding: 1rem 1.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: #333333;
  z-index: 2;
  
  ${props => {
    switch(props.$position) {
      case 'top-left':
        return 'top: 10%; left: -5%;';
      case 'top-right':
        return 'top: 15%; right: -5%;';
      case 'bottom-left':
        return 'bottom: 15%; left: -5%;';
      case 'bottom-right':
        return 'bottom: 10%; right: -5%;';
      default:
        return '';
    }
  }}

  @media (max-width: 768px) {
    display: none;
  }

  svg {
    color: #007ACC;
  }

  .value {
    color: #28A745;
    font-weight: 700;
  }
`;

const EmojiIcon = styled.div`
  font-size: 180px;
  position: relative;
  z-index: 1;
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }

  @media (max-width: 768px) {
    font-size: 120px;
  }
`;

// Feature highlights
const FeatureList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const FeatureItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(10px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  }

  svg {
    color: #28A745;
    flex-shrink: 0;
  }

  span {
    font-size: 1rem;
    color: #333333;
    font-weight: 500;
  }
`;

export const ContentSectionStyled = styled.section<{ $reverse?: boolean; $bg?: string }>`
  padding: 8rem 2rem;
  background: ${props => props.$bg || props.theme.colors.background};
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    padding: 4rem 1rem;
  }
`;

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
  return (
    <ContentSectionWrapper $reverse={reverse} $bg={bg}>
      <ContentGrid $reverse={reverse}>
        <ContentText
          initial={{ opacity: 0, x: reverse ? 50 : -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>
            {titleHighlight ? (
              <>
                {title.split(titleHighlight)[0]}
                <span className="highlight">{titleHighlight}</span>
                {title.split(titleHighlight)[1]}
              </>
            ) : (
              title
            )}
          </h2>
          <p>{text1}</p>
          {text2 && <p>{text2}</p>}

          {features.length > 0 && (
            <FeatureList>
              {features.map((feature, index) => (
                <FeatureItem
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Star size={20} fill="#28A745" />
                  <span>{feature}</span>
                </FeatureItem>
              ))}
            </FeatureList>
          )}

          {ctaText && (
            <CTALink
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => alert('Navegando para a funcionalidade...')}
            >
              {ctaText}
              <ArrowRight size={18} />
            </CTALink>
          )}
        </ContentText>

        <ContentVisual
          initial={{ opacity: 0, x: reverse ? -50 : 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <VisualBox
            $variant={visualVariant}
            whileHover={{ scale: 1.05, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <EmojiIcon>{visualContent}</EmojiIcon>
          </VisualBox>

          {/* Floating mini cards */}
          {miniCards.map((card, index) => (
            <FloatingMiniCard
              key={index}
              $position={card.position}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.5,
              }}
            >
              {card.icon}
              <div>
                {card.text}
                {card.value && <div className="value">{card.value}</div>}
              </div>
            </FloatingMiniCard>
          ))}
        </ContentVisual>
      </ContentGrid>
    </ContentSectionWrapper>
  );
};