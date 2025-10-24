import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";
import Animation from "../components/common/Animation";
import * as S from "./OnboardingPage.style";
import { presentationSteps } from "../data/onboarding-steps-data";

const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? "100%" : "-100%",
    opacity: 0,
  }),
};

export const OnboardingPage: React.FC<{ onComplete: () => void }> = ({
  onComplete,
}) => {
  const [[step, direction], setStep] = useState([0, 0]);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step === presentationSteps.length - 1) {
      onComplete();
      navigate("/register");
    } else {
      setStep([step + 1, 1]);
    }
  };

  const goToStep = (stepIndex: number) => {
    setStep([stepIndex, stepIndex > step ? 1 : -1]);
  };

  const currentStepData = presentationSteps[step];
  const isLastStep = step === presentationSteps.length - 1;

  return (
    <S.OnboardingContainer>
      <S.SlidesWrapper>
        <AnimatePresence initial={false} custom={direction}>
          <S.Slide
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
          >
            <S.AnimationContainer>
              <Animation animationData={currentStepData.animation} size={250} />{" "}
            </S.AnimationContainer>
            <S.Title>{currentStepData.title}</S.Title>
            <S.Text>{currentStepData.description}</S.Text>
            <Button size="large" onClick={handleNext}>
              {isLastStep ? "Começar Agora" : "Próximo"}
            </Button>
          </S.Slide>
        </AnimatePresence>
      </S.SlidesWrapper>

      <S.Navigation>
        <S.DotsContainer>
          {presentationSteps.map((_, i) => (
            <S.Dot
              key={i}
              $active={i === step}
              onClick={() => goToStep(i)}
              aria-label={`Ir para o passo ${i + 1}`}
            />
          ))}
        </S.DotsContainer>
      </S.Navigation>
    </S.OnboardingContainer>
  );
};

export default OnboardingPage;
