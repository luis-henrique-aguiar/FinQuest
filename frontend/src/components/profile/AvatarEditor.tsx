import React, { useState, useRef } from "react";
import styled from "styled-components";
import { Camera, Upload } from "react-feather";
import { Modal } from "../common/Modal";
import Button from "../common/Button";
import { useToast } from "../../hooks/useToast";

interface AvatarEditorProps {
  currentAvatar: string;
  userName: string;
  userLevel: number;
  onSave: (newAvatarUrl: string, file?: File) => Promise<void>;
}

const AvatarContainer = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  cursor: pointer;
`;

const AvatarImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${({ theme }) => theme.colors.primary}33;
  transition: all 0.2s ease;
`;

const AvatarOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${AvatarContainer}:hover & {
    opacity: 1;
  }
`;

const EditIcon = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
`;

const LevelBadge = styled.div`
  position: absolute;
  bottom: 0px;
  right: -10px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.white};
  font-size: 0.75rem;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  padding: 2px 8px;
  border-radius: ${({ theme }) => theme.borderRadius.pill};
  border: 2px solid ${({ theme }) => theme.colors.white};
  box-shadow: ${({ theme }) => theme.shadows.small};
  z-index: 1;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const PreviewSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const PreviewAvatar = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid ${({ theme }) => theme.colors.primary}33;
`;

const OptionsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SectionTitle = styled.h4`
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.textDark};
`;

const OptionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  background-color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Nunito Sans", sans-serif;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primary}11;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  &:active {
    transform: translateY(0);
  }
`;

const OptionIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #28a745 0%, #007acc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.2rem;
`;

const OptionContent = styled.div`
  text-align: left;
  
  h5 {
    margin: 0 0 4px 0;
    font-size: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textDark};
  }
  
  p {
    margin: 0;
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.textMedium};
  }
`;

const FileInput = styled.input`
  display: none;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  
  @media (max-width: 480px) {
    flex-direction: column;
  }
`;

const HelpText = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMedium};
  margin: 0;
  text-align: center;
`;

const UploadArea = styled.div<{ $isDragOver: boolean }>`
  border: 2px dashed ${({ $isDragOver, theme }) => 
    $isDragOver ? theme.colors.primary : '#e5e7eb'};
  border-radius: 12px;
  padding: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  background-color: ${({ $isDragOver, theme }) => 
    $isDragOver ? `${theme.colors.primary}11` : '#f9fafb'};
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primary}11;
  }
`;

const UploadIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #28a745 0%, #007acc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing.sm};
  color: white;
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const defaultAvatar = `https://api.dicebear.com/8.x/initials/svg?seed=${userName}`;
  const displayAvatar = previewUrl || currentAvatar || defaultAvatar;

  const handleOpenModal = () => {
    setPreviewUrl(currentAvatar || "");
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreviewUrl(result);
        setSelectedFile(file);
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
      addToast("Foto de perfil atualizada!", "success");
    } catch (error) {
      console.error("Erro ao salvar avatar:", error);
      addToast("Erro ao atualizar foto de perfil", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseInitials = () => {
    setPreviewUrl("");
    setSelectedFile(null);
  };

  const handleUseRandomAvatar = () => {
    const randomSeed = Math.random().toString(36).substring(7);
    setPreviewUrl(`https://api.dicebear.com/8.x/avataaars/svg?seed=${randomSeed}`);
    setSelectedFile(null);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <AvatarContainer onClick={handleOpenModal}>
        <AvatarImage src={currentAvatar || defaultAvatar} alt={`Foto de ${userName}`} />
        <AvatarOverlay>
          <EditIcon>
            <Camera size={20} />
            <span>Editar</span>
          </EditIcon>
        </AvatarOverlay>
        <LevelBadge>NÍVEL {userLevel}</LevelBadge>
      </AvatarContainer>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Alterar Foto de Perfil"
      >
        <ModalContent>
          <PreviewSection>
            <PreviewAvatar src={displayAvatar} alt="Preview" />
            <HelpText>Preview da sua nova foto de perfil</HelpText>
          </PreviewSection>

          <OptionsSection>
            <SectionTitle>Escolha uma opção:</SectionTitle>
            
            <UploadArea
              $isDragOver={isDragOver}
              onClick={handleUploadClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <UploadIcon>
                <Upload size={24} />
              </UploadIcon>
              <h5 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 600 }}>
                Enviar uma foto
              </h5>
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#6c757d' }}>
                Clique aqui ou arraste uma imagem
              </p>
              <FileInput
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
              />
            </UploadArea>
            
            <OptionButton onClick={handleUseInitials}>
              <OptionIcon>👤</OptionIcon>
              <OptionContent>
                <h5>Usar iniciais do nome</h5>
                <p>Gera um avatar com suas iniciais</p>
              </OptionContent>
            </OptionButton>

            <OptionButton onClick={handleUseRandomAvatar}>
              <OptionIcon>🎲</OptionIcon>
              <OptionContent>
                <h5>Avatar aleatório</h5>
                <p>Gera um avatar cartoon aleatório</p>
              </OptionContent>
            </OptionButton>
          </OptionsSection>

          <ButtonsContainer>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isLoading}
              style={{ flex: 1 }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={handleSave}
              disabled={isLoading}
              style={{ flex: 1 }}
            >
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </ButtonsContainer>
        </ModalContent>
      </Modal>
    </>
  );
};