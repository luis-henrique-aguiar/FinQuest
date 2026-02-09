import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';

import OnboardingPage from './OnboardingPage';
import { presentationSteps } from '@/features/onboarding/data/onboarding-steps-data';

const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useNavigate: () => mockedNavigate };
});

const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <BrowserRouter>
        {children}
    </BrowserRouter>
);

describe('OnboardingPage Component', () => {
    const mockOnComplete = vi.fn();

    beforeEach(() => {
        mockOnComplete.mockClear();
        mockedNavigate.mockClear();
    });

    it('deve renderizar o conteúdo do primeiro slide inicialmente', () => {
        render(<OnboardingPage onComplete={mockOnComplete} />, { wrapper: Wrapper });
        expect(screen.getByText(presentationSteps[0].title)).toBeInTheDocument();
        expect(screen.getByText(presentationSteps[0].description)).toBeInTheDocument();
        // Podemos continuar usando getByRole aqui, pois só há um botão inicialmente
        expect(screen.getByRole('button', { name: /Próximo/i })).toBeInTheDocument();
        // OU usar getByTestId desde o início
        // expect(screen.getByTestId("button-onboarding")).toHaveTextContent(/Próximo/i);
    });

    it('deve navegar pelos slides ao clicar em "Próximo"', async () => {
        render(<OnboardingPage onComplete={mockOnComplete} />, { wrapper: Wrapper });

        for (let i = 0; i < presentationSteps.length - 1; i++) {
            const currentTitle = presentationSteps[i].title;
            const nextTitle = presentationSteps[i + 1].title;

            // Encontra o botão (deve haver apenas um visível quando a animação termina)
            // Usamos findByTestId que já espera o elemento aparecer/ser único
            const button = await screen.findByTestId("button-onboarding");
            fireEvent.click(button);

            // Espera até que o TÍTULO ANTERIOR desapareça E o PRÓXIMO TÍTULO apareça
            await waitFor(() => {
                // Verifica se o título anterior SUMIU
                expect(screen.queryByText(currentTitle)).not.toBeInTheDocument();
                // Verifica se o título seguinte APARECEU
                expect(screen.getByText(nextTitle)).toBeInTheDocument();
            });

            // Verificações adicionais (opcional, mas bom ter)
            expect(screen.getByText(presentationSteps[i + 1].description)).toBeInTheDocument();
        }

        // No último slide, verifica o texto do botão
        // Usamos findByTestId novamente para garantir que estamos pegando o botão certo após a última animação
        const lastButton = await screen.findByTestId("button-onboarding");
        expect(lastButton).toHaveTextContent(/Começar Agora/i);
    });

    it('deve chamar onComplete e navegar ao clicar em "Começar Agora" no último slide', async () => {
        render(<OnboardingPage onComplete={mockOnComplete} />, { wrapper: Wrapper });

        // Navega até o último slide
        for (let i = 0; i < presentationSteps.length - 1; i++) {
            const currentTitle = presentationSteps[i].title;
            const nextTitle = presentationSteps[i + 1].title;

            const button = await screen.findByTestId("button-onboarding");
            fireEvent.click(button);
            await waitFor(() => {
                expect(screen.queryByText(currentTitle)).not.toBeInTheDocument();
                expect(screen.getByText(nextTitle)).toBeInTheDocument();
            });
        }

        // Clica no botão final
        const startButton = await screen.findByTestId("button-onboarding");
        expect(startButton).toHaveTextContent(/Começar Agora/i);
        fireEvent.click(startButton);

        // Verifica as chamadas
        expect(mockOnComplete).toHaveBeenCalledTimes(1);
        expect(mockedNavigate).toHaveBeenCalledWith('/register');
    });

    it('deve navegar para o slide correto ao clicar em um dot', async () => {
        render(<OnboardingPage onComplete={mockOnComplete} />, { wrapper: Wrapper });
        const dots = screen.getAllByRole('button', { name: /Ir para o passo/i });
        const lastDotIndex = presentationSteps.length - 1;
        const firstTitle = presentationSteps[0].title;
        const lastTitle = presentationSteps[lastDotIndex].title;

        fireEvent.click(dots[lastDotIndex]);

        // Espera o primeiro título sumir e o último aparecer
        await waitFor(() => {
            expect(screen.queryByText(firstTitle)).not.toBeInTheDocument();
            expect(screen.getByText(lastTitle)).toBeInTheDocument();
        });
        expect(await screen.findByTestId("button-onboarding")).toHaveTextContent(/Começar Agora/i);
    });
});