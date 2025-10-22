import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App Component', () => {
  it('deve renderizar o componente App corretamente', () => {
    render(<App />); 
    expect(true).toBe(true); 
  });
});