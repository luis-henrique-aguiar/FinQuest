import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { presentationSteps } from '../data/onboarding-steps-data';

export const useOnboarding = (onComplete?: () => void) => {
    const [[step, direction], setStep] = useState([0, 0]);
    const navigate = useNavigate();

    const handleNext = () => {
        if (step === presentationSteps.length - 1) {
            if (onComplete) {
                onComplete();
            }
            navigate('/register');
        } else {
            setStep([step + 1, 1]);
        }
    };

    const goToStep = (stepIndex: number) => {
        setStep([stepIndex, stepIndex > step ? 1 : -1]);
    };

    const currentStepData = presentationSteps[step];
    const isLastStep = step === presentationSteps.length - 1;

    return {
        step,
        direction,
        handleNext,
        goToStep,
        currentStepData,
        isLastStep,
        presentationSteps,
    };
};
