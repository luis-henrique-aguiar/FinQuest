import React from 'react';
import Lottie from 'lottie-react';
import Button from '../common/Button';
import * as S from './LevelUpModal.styles';
import trophyAnimation from '../../assets/animations/coins_falling.json';

interface LevelUpModalProps {
  newLevel: number;
  onClose: () => void;
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 20 } },
  exit: { scale: 0.8, opacity: 0, transition: { duration: 0.2 } },
};

export const LevelUpModal: React.FC<LevelUpModalProps> = ({ newLevel, onClose }) => {
  return (
    <S.Overlay
      variants={overlayVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <S.ModalCard variants={modalVariants}>
        <S.AnimationContainer>
          <Lottie animationData={trophyAnimation} loop={false} />
        </S.AnimationContainer>
        <S.Title>Parabéns!</S.Title>
        <S.Text>
          Você avançou para o <strong>Nível {newLevel}</strong>!
          <br />
          Novas conquistas e desafios esperam por você.
        </S.Text>
        <Button variant="primary" onClick={onClose} fullWidth>
          Continuar Jornada
        </Button>
      </S.ModalCard>
    </S.Overlay>
  );
};