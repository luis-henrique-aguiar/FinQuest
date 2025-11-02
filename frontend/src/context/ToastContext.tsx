import React, {
  useState,
  createContext,
  type ReactNode,
  useCallback,
} from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, Info, X } from "react-feather";

export type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}

export interface ToastContextType {
  addToast: (message: string, type?: ToastType) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

const ToastContainer = styled(motion.div)`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ToastWrapper = styled(motion.div)<{ $type: ToastType }>`
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.medium};
  color: white;
  background-color: ${({ theme, $type }) => {
    switch ($type) {
      case "success":
        return theme.colors.secondary;
      case "error":
        return theme.colors.error;
      case "info":
      default:
        return "#343A40";
    }
  }};
  box-shadow: ${({ theme }) => theme.shadows.large};
  min-width: 250px;
  max-width: 400px;
`;

const IconWrapper = styled.div`
  margin-right: 0.8rem;
  display: flex;
`;

const Message = styled.span`
  flex-grow: 1;
  font-size: 0.95rem;
  line-height: 1.4;
`;

export const ToastProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType = "info") => {
    const id = Date.now();
    const newToast: ToastMessage = { id, message, type };
    setToasts((prev) => [newToast, ...prev]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 5000); // Toast some após 5 segundos
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case "success":
        return <CheckCircle size={20} />;
      case "error":
        return <AlertTriangle size={20} />;
      case "info":
      default:
        return <Info size={20} />;
    }
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastContainer>
        <AnimatePresence>
          {toasts.map(({ id, message, type }) => (
            <ToastWrapper
              key={id}
              $type={type}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              layout
            >
              <IconWrapper>{getIcon(type)}</IconWrapper>
              <Message>{message}</Message>
              {/* Botão opcional para fechar manualmente */}
              <button
                onClick={() => removeToast(id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  marginLeft: "1rem",
                }}
              >
                <X size={18} />
              </button>
            </ToastWrapper>
          ))}
        </AnimatePresence>
      </ToastContainer>
    </ToastContext.Provider>
  );
};
