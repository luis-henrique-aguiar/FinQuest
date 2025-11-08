import React, { type ReactNode } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "react-feather";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
`;

const ModalContainer = styled(motion.div)`
  width: 100%;
  max-width: 500px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.large};
  padding: ${({ theme }) => theme.spacing.xl};
  position: relative;
  box-shadow: ${({ theme }) => theme.shadows.large};
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textMedium};
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background};
  }
`;

const ModalHeader = styled.h2`
  margin-top: 0;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <Overlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose} // Permite fechar clicando fora do modal
        >
          <ModalContainer
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CloseButton onClick={onClose}>
              <X />
            </CloseButton>
            {title && <ModalHeader>{title}</ModalHeader>}
            {children}
          </ModalContainer>
        </Overlay>
      )}
    </AnimatePresence>
  );
};
