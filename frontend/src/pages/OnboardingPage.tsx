import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Animation from "../components/common/Animation";
import { cn } from "@/lib/utils";
import { useOnboarding } from "@/features/onboarding/hooks/useOnboarding";

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
  const {
    step,
    direction,
    handleNext,
    goToStep,
    currentStepData,
    isLastStep,
    presentationSteps,
  } = useOnboarding(onComplete);

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-white dark:bg-zinc-950">
      <div className="flex-grow relative flex overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
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
            className="absolute w-full h-full flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="w-[250px] h-[250px] mb-8">
              <Animation animationData={currentStepData.animation} size={250} />
            </div>

            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-zinc-900 dark:text-zinc-50 mt-4">
              {currentStepData.title}
            </h1>

            <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed mb-12 max-w-[500px]">
              {currentStepData.description}
            </p>

            <Button
              size="lg"
              onClick={handleNext}
              data-testid="button-onboarding"
              className="text-lg px-8 py-6 rounded-xl bg-gradient-to-r from-[#007ACC] to-[#28A745] hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              {isLastStep ? "Começar Agora" : "Próximo"}
            </Button>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex flex-col items-center p-8 w-full">
        <div className="flex gap-3">
          {presentationSteps.map((_, i) => (
            <button
              key={i}
              onClick={() => goToStep(i)}
              aria-label={`Ir para o passo ${i + 1}`}
              className={cn(
                "w-3 h-3 rounded-full transition-all duration-300 border-none cursor-pointer p-0",
                i === step ? "bg-[#28A745] w-8" : "bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400 dark:hover:bg-zinc-600"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
