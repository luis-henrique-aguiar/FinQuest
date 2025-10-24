import '@testing-library/jest-dom';
import { vi } from 'vitest'; // Importe 'vi' do vitest

vi.mock('lottie-react', () => ({
    default: vi.fn().mockImplementation(() => {
        return <div data-testid="mock-lottie-animation">Mock Lottie</div>;
    }),
}));