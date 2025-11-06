import React from 'react';
import styled, { keyframes } from 'styled-components';

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.background}E6;
  z-index: 9999;
  backdrop-filter: blur(5px);
`;

const Spinner = styled.div`
  border: 4px solid ${({ theme }) => theme.colors.white}4D;
  border-top: 4px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spinAnimation} 1s linear infinite;
`;

export const FullScreenLoader: React.FC = () => {
  return (
    <LoaderOverlay>
      <Spinner />
    </LoaderOverlay>
  );
};

export default FullScreenLoader;