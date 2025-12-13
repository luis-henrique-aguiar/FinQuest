import React, { useState, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { Camera, Upload, User, Shuffle, Check } from "react-feather";
import { Modal } from "../common/Modal";
import Button from "../common/Button";
import { useToast } from "../../hooks/useToast";
import { motion } from "framer-motion";

interface AvatarEditorProps {
  currentAvatar: string;
  userName: string;
  userLevel: number;
  onSave: (newAvatarUrl: string, file?: File) => Promise<void>;
}

const float = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
`;

const AvatarContainer = styled.div`
  position: relative;
  width: 110px;
  height: 110px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid ${({ theme }) => theme.colors.white};
  box-shadow: 
    0 4px 20px rgba(0, 122, 204, 0.2),
    0 0 0 3px ${({ theme }) => theme.colors.primary}22;
  transition: all 0.3s ease;
`;

const AvatarOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(
    135deg,
    rgba(0, 122, 204, 0.85) 0%,
    rgba(40, 167, 69, 0.85) 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: all 0.3s ease;
  backdrop-filter: blur(2px);
  
  ${AvatarContainer}:hover & {
    opacity: 1;
  }
`;

const EditIconWrapper = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const LevelBadge = styled.div`
  position: absolute;
  bottom: 2px;
  right: -8px;
  background: linear-gradient(135deg, #007ACC 0%, #005A99 100%);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 20px;
  border: 3px solid ${({ theme }) => theme.colors.white};
  box-shadow: 0 2px 8px rgba(0, 122, 204, 0.4);
  z-index: 1;
  animation: ${float} 3s ease-in-out infinite;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.sm};
`;

const PreviewSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: linear-gradient(
    135deg,
    ${({ theme }) => theme.colors.primary}08 0%,
    ${({ theme }) => theme.colors.secondary}08 100%
  );
  border-radius: 20px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #007ACC, #28A745, #FFA500);
  }
`;

const PreviewAvatarWrapper = styled(motion.div)`
  position: relative;
`;

const PreviewAvatar = styled.img`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid ${({ theme }) => theme.colors.white};
  box-shadow: 
    0 8px 32px rgba(0, 122, 204, 0.25),
    0 0 0 4px ${({ theme }) => theme.colors.primary}22;
`;

const PreviewBadge = styled.div`
  position: absolute;
  bottom: 5px;
  right: 5px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #28A745 0%, #20C997 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: 3px solid white;
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.4);
`;

const PreviewLabel = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textMedium};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;

  &::before, &::after {
    content: '';
    width: 20px;
    height: 1px;
    background: ${({ theme }) => theme.colors.border};
  }
`;

const OptionsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SectionTitle = styled.h4`
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMedium};
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const UploadArea = styled(motion.div)<{ $isDragOver: boolean; $hasFile: boolean }>`
  border: 2px dashed ${({ $isDragOver, $hasFile, theme }) => 
    $hasFile ? theme.colors.secondary : 
    $isDragOver ? theme.colors.primary : 
    theme.colors.border};
  border-radius: 16px;
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  background: ${({ $isDragOver, $hasFile, theme }) => 
    $hasFile ? `${theme.colors.secondary}08` :
    $isDragOver ? `${theme.colors.primary}08` : 
    theme.colors.background};
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    transition: left 0.5s;
  }
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary}08;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 122, 204, 0.15);

    &::before {
      left: 100%;
    }
  }
`;

const UploadIcon = styled(motion.div)<{ $hasFile: boolean }>`
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${({ $hasFile }) => 
    $hasFile 
      ? 'linear-gradient(135deg, #28A745 0%, #20C997 100%)'
      : 'linear-gradient(135deg, #007ACC 0%, #00A3E0 100%)'
  };
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing.md};
  color: white;
  box-shadow: ${({ $hasFile }) => 
    $hasFile 
      ? '0 8px 24px rgba(40, 167, 69, 0.35)'
      : '0 8px 24px rgba(0, 122, 204, 0.35)'
  };
`;

const UploadTitle = styled.h5`
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
`;

const UploadHint = styled.p`
  margin: 0;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textMedium};
`;

const FileInput = styled.input`
  display: none;
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 400px) {
    grid-template-columns: 1fr;
  }
`;

const OptionButton = styled(motion.button)<{ $isActive?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  border: 2px solid ${({ $isActive, theme }) => 
    $isActive ? theme.colors.primary : theme.colors.border};
  border-radius: 16px;
  background: ${({ $isActive, theme }) => 
    $isActive ? `${theme.colors.primary}08` : theme.colors.white};
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  position: relative;
  overflow: hidden;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.primary}08;
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 122, 204, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
`;

const OptionIconWrapper = styled.div<{ $gradient: string }>`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: ${({ $gradient }) => $gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const OptionLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textDark};
`;

const OptionHint = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textMedium};
`;

const FooterSection = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.md};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  @media (max-width: 400px) {
    flex-direction: column;
  }
`;

const StyledButton = styled(Button)`
  flex: 1;
  padding: 14px 24px;
  font-weight: 600;
  border-radius: 12px;
`;

export const AvatarEditor: React.FC<AvatarEditorProps> = ({
  currentAvatar,
  userName,
  userLevel,
  onSave,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedOption, setSelectedOption] = useState<'upload' | 'initials' | 'random' | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const defaultAvatar = `https://api.dicebear.com/8.x/initials/svg?seed=${userName}&backgroundColor=007ACC`;
  const displayAvatar = previewUrl || currentAvatar || defaultAvatar;

  const handleOpenModal = () => {
    setPreviewUrl(currentAvatar || "");
    setSelectedFile(null);
    setSelectedOption(null);
    setIsModalOpen(true);
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      // Validar tamanho (5MB)
      if (file.size > 5 * 1024 * 1024) {
        addToast("A imagem deve ter no máximo 5MB", "error");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
        setSelectedFile(file);
        setSelectedOption('upload');
      };
      reader.readAsDataURL(file);
    } else {
      addToast("Por favor, selecione apenas arquivos de imagem", "error");
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(previewUrl, selectedFile || undefined);
      setIsModalOpen(false);
      addToast("Foto de perfil atualizada com sucesso!", "success");
    } catch (error) {
      console.error("Erro ao salvar avatar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseInitials = () => {
    const initialsAvatar = `https://api.dicebear.com/8.x/initials/svg?seed=${userName}&backgroundColor=007ACC`;
    setPreviewUrl(initialsAvatar);
    setSelectedFile(null);
    setSelectedOption('initials');
  };

  const handleUseRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    const randomAvatar = `https://avatar.iran.liara.run/public?username=${randomSeed}`;
    setPreviewUrl(randomAvatar);
    setSelectedFile(null);
    setSelectedOption('random');
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const hasChanges = previewUrl !== currentAvatar && previewUrl !== "";

  return (
    <>
      <AvatarContainer onClick={handleOpenModal}>
        <AvatarImage src={currentAvatar || defaultAvatar} alt={`Foto de ${userName}`} />
        <AvatarOverlay>
          <EditIconWrapper>
            <Camera size={24} />
            <span>Editar</span>
          </EditIconWrapper>
        </AvatarOverlay>
        <LevelBadge>Nv. {userLevel}</LevelBadge>
      </AvatarContainer>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Alterar Foto de Perfil"
      >
        <ModalContent>
          {/* Preview Section */}
          <PreviewSection>
            <PreviewAvatarWrapper
              key={displayAvatar}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <PreviewAvatar src={displayAvatar} alt="Preview" />
              {hasChanges && (
                <PreviewBadge>
                  <Check size={18} />
                </PreviewBadge>
              )}
            </PreviewAvatarWrapper>
            <PreviewLabel>
              {hasChanges ? "Nova foto selecionada" : "Foto atual"}
            </PreviewLabel>
          </PreviewSection>

          {/* Upload Area */}
          <OptionsSection>
            <SectionTitle>Enviar Foto</SectionTitle>
            
            <UploadArea
              $isDragOver={isDragOver}
              $hasFile={selectedOption === 'upload'}
              onClick={handleUploadClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <UploadIcon
                $hasFile={selectedOption === 'upload'}
                animate={selectedOption === 'upload' ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {selectedOption === 'upload' ? <Check size={28} /> : <Upload size={28} />}
              </UploadIcon>
              <UploadTitle>
                {selectedOption === 'upload' ? "Foto selecionada!" : "Clique ou arraste"}
              </UploadTitle>
              <UploadHint>
                {selectedOption === 'upload' 
                  ? selectedFile?.name 
                  : "PNG, JPG ou GIF (máx. 5MB)"}
              </UploadHint>
              <FileInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
              />
            </UploadArea>
          </OptionsSection>

          {/* Quick Options */}
          <OptionsSection>
            <SectionTitle>Opções Rápidas</SectionTitle>
            
            <OptionsGrid>
              <OptionButton
                $isActive={selectedOption === 'initials'}
                onClick={handleUseInitials}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <OptionIconWrapper $gradient="linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)">
                  <User size={24} />
                </OptionIconWrapper>
                <OptionLabel>Usar Iniciais</OptionLabel>
                <OptionHint>Avatar com suas iniciais</OptionHint>
              </OptionButton>

              <OptionButton
                $isActive={selectedOption === 'random'}
                onClick={handleUseRandomAvatar}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <OptionIconWrapper $gradient="linear-gradient(135deg, #F59E0B 0%, #F97316 100%)">
                  <Shuffle size={24} />
                </OptionIconWrapper>
                <OptionLabel>Avatar Aleatório</OptionLabel>
                <OptionHint>Gerar novo avatar</OptionHint>
              </OptionButton>
            </OptionsGrid>
          </OptionsSection>

          {/* Footer Buttons */}
          <FooterSection>
            <StyledButton
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isLoading}
            >
              Cancelar
            </StyledButton>
            <StyledButton
              variant="primary"
              onClick={handleSave}
              disabled={isLoading || !hasChanges}
            >
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </StyledButton>
          </FooterSection>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AvatarEditor;