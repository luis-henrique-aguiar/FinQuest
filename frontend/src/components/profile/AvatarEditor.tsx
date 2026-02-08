import React, { useState, useRef } from "react";
import { Camera, Upload, User, Shuffle, Check } from "react-feather";
import { Modal } from "../common/Modal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";


interface AvatarEditorProps {
  currentAvatar: string;
  userName: string;
  userLevel: number;
  onSave: (newAvatarUrl: string, file?: File) => Promise<void>;
}

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
        toast.error("A imagem deve ter no máximo 5MB");
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
      toast.error("Por favor, selecione apenas arquivos de imagem");
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
      // Success toast handled by parent or hook
      // toast.success("Foto de perfil atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar avatar:", error);
      // Error toast handled by parent or hook
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
      <div
        className="relative w-[110px] h-[110px] mb-4 cursor-pointer group mx-auto"
        onClick={handleOpenModal}
      >
        <img
          src={currentAvatar || defaultAvatar}
          alt={`Foto de ${userName}`}
          className="w-full h-full rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-lg transition-all duration-300 ring-2 ring-primary/20"
        />
        <div className="absolute inset-0 rounded-full bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[1px] text-white">
          <div className="flex flex-col items-center gap-1.5 text-xs font-bold uppercase tracking-wide">
            <Camera size={24} />
            <span>Editar</span>
          </div>
        </div>
        <div className="absolute bottom-0.5 -right-2 bg-gradient-to-br from-primary to-blue-600 text-white text-[0.7rem] font-bold px-2.5 py-1 rounded-full border-[3px] border-white dark:border-zinc-800 shadow-sm z-10 animate-pulse">
          Nv. {userLevel}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Alterar Foto de Perfil"
      >
        <div className="flex flex-col gap-6 p-2">
          {/* Preview Section */}
          <div className="flex flex-col items-center gap-4 p-6 bg-gradient-to-br from-primary/5 to-cyan-500/5 rounded-2xl relative overflow-hidden border border-primary/10">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-green-500 to-orange-500" />

            <motion.div
              key={displayAvatar}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="relative"
            >
              <img
                src={displayAvatar}
                alt="Preview"
                className="w-[140px] h-[140px] rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-xl"
              />
              {hasChanges && (
                <div className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white border-[3px] border-white dark:border-zinc-800 shadow-lg">
                  <Check size={18} />
                </div>
              )}
            </motion.div>

            <div className="flex items-center gap-2 text-sm text-zinc-500 font-medium">
              <span className="w-5 h-[1px] bg-zinc-300 dark:bg-zinc-700" />
              {hasChanges ? "Nova foto selecionada" : "Foto atual"}
              <span className="w-5 h-[1px] bg-zinc-300 dark:bg-zinc-700" />
            </div>
          </div>

          {/* Upload Area */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Enviar Foto</h4>

            <motion.div
              className={cn(
                "border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-300 cursor-pointer relative overflow-hidden group",
                isDragOver ? "border-primary bg-primary/5" : "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/50",
                selectedOption === 'upload' && "border-green-500 bg-green-500/5"
              )}
              onClick={handleUploadClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <motion.div
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 text-white shadow-lg",
                  selectedOption === 'upload'
                    ? "bg-gradient-to-br from-green-500 to-green-600 shadow-green-500/30"
                    : "bg-gradient-to-br from-primary to-blue-500 shadow-primary/30"
                )}
                animate={selectedOption === 'upload' ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {selectedOption === 'upload' ? <Check size={28} /> : <Upload size={28} />}
              </motion.div>

              <h5 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
                {selectedOption === 'upload' ? "Foto selecionada!" : "Clique ou arraste"}
              </h5>
              <p className="text-sm text-zinc-500">
                {selectedOption === 'upload'
                  ? selectedFile?.name
                  : "PNG, JPG ou GIF (máx. 5MB)"}
              </p>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </motion.div>
          </div>

          {/* Quick Options */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Opções Rápidas</h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <motion.button
                className={cn(
                  "flex flex-col items-center gap-2 p-4 border-2 rounded-2xl transition-all duration-300 font-sans",
                  selectedOption === 'initials'
                    ? "border-primary bg-primary/5"
                    : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-primary hover:bg-primary/5"
                )}
                onClick={handleUseInitials}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-md">
                  <User size={24} />
                </div>
                <div className="text-center">
                  <span className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">Usar Iniciais</span>
                  <span className="block text-xs text-zinc-500">Gerar com seu nome</span>
                </div>
              </motion.button>

              <motion.button
                className={cn(
                  "flex flex-col items-center gap-2 p-4 border-2 rounded-2xl transition-all duration-300 font-sans",
                  selectedOption === 'random'
                    ? "border-orange-500 bg-orange-500/5"
                    : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-orange-500 hover:bg-orange-500/5"
                )}
                onClick={handleUseRandomAvatar}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md">
                  <Shuffle size={24} />
                </div>
                <div className="text-center">
                  <span className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100">Aleatório</span>
                  <span className="block text-xs text-zinc-500">Gerar novo avatar</span>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={isLoading}
              className="flex-1 h-12 rounded-xl font-semibold border-2 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading || !hasChanges}
              className="flex-1 h-12 rounded-xl font-semibold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
            >
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};