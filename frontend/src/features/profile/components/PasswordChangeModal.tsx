import React, { useState } from "react";
import { Eye, EyeOff, Lock } from "react-feather";
import { Modal } from "@/components/common/Modal";
import Button from "@/components/common/Button";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import api from "@/services/api";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { cn } from "@/lib/utils";

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const { addToast } = useToast();
  const { firebaseUser, user, logout } = useAuth();

  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return Math.min(strength, 4);
  };

  const passwordStrength = calculatePasswordStrength(formData.newPassword);

  const getStrengthColor = (strength: number) => {
    if (strength <= 1) return "bg-red-500";
    if (strength <= 2) return "bg-orange-500";
    if (strength <= 3) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthTextColor = (strength: number) => {
    if (strength <= 1) return "text-red-500";
    if (strength <= 2) return "text-orange-500";
    if (strength <= 3) return "text-yellow-500";
    return "text-green-500";
  };

  const getStrengthText = (strength: number): string => {
    switch (strength) {
      case 0:
      case 1:
        return "Muito fraca";
      case 2:
        return "Fraca";
      case 3:
        return "Boa";
      case 4:
        return "Excelente";
      default:
        return "";
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.currentPassword) {
      addToast("Senha atual é obrigatória", "error");
      return;
    }

    if (formData.newPassword.length < 6) {
      addToast("Nova senha deve ter pelo menos 6 caracteres", "error");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      addToast("Nova senha e confirmação não coincidem", "error");
      return;
    }

    if (!user || !user.email || !firebaseUser) {
      addToast("Sessão inválida. Por favor, faça login novamente.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const credential = EmailAuthProvider.credential(
        user.email!,
        formData.currentPassword
      );
      await reauthenticateWithCredential(firebaseUser, credential);

      await api.put("/users/password", {
        newPassword: formData.newPassword,
        confirmationPassword: formData.confirmPassword,
      });

      await logout();

      addToast(
        "Senha alterada com sucesso! Por segurança, você foi desconectado e deve fazer login novamente com sua nova senha.",
        "success"
      );
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      onClose();
    } catch (error: any) {
      let errorMessage = "Erro ao alterar senha. Tente novamente.";

      if (error?.response?.data?.details) {
        addToast(`${error.response.data.details[0]}`, "error");
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/invalid-credential"
      ) {
        errorMessage = "A senha atual digitada está incorreta.";
      } else if (error.code === "auth/weak-password") {
        errorMessage = "A nova senha é muito fraca (mínimo 6 caracteres).";
      }

      addToast(errorMessage, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Alterar Senha">
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="bg-gradient-to-br from-[#28A745]/10 to-[#007ACC]/10 border border-[#28A745]/20 rounded-xl p-4">
          <h4 className="flex items-center gap-2 m-0 mb-2 font-semibold text-sm text-[#007ACC] dark:text-[#007ACCEA]">
            <span>🔒</span>
            Dica de Segurança
          </h4>
          <p className="m-0 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Use uma senha forte com pelo menos 8 caracteres, incluindo letras
            maiúsculas, minúsculas, números e símbolos.
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="currentPassword" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Senha Atual
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4 text-zinc-500 z-10 pointer-events-none">
                <Lock size={16} />
              </div>
              <input
                id="currentPassword"
                type={showPasswords.current ? "text" : "password"}
                placeholder="Digite sua senha atual"
                value={formData.currentPassword}
                onChange={(e) =>
                  handleInputChange("currentPassword", e.target.value)
                }
                required
                className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-base focus:outline-none focus:border-[#007ACC] focus:ring-4 focus:ring-[#007ACC]/20 transition-all duration-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("current")}
                className="absolute right-4 p-1 text-zinc-500 hover:text-[#007ACC] hover:bg-[#007ACC]/10 rounded bg-transparent border-none cursor-pointer transition-colors"
              >
                {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="newPassword" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Nova Senha
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4 text-zinc-500 z-10 pointer-events-none">
                <Lock size={16} />
              </div>
              <input
                id="newPassword"
                type={showPasswords.new ? "text" : "password"}
                placeholder="Digite sua nova senha"
                value={formData.newPassword}
                onChange={(e) => handleInputChange("newPassword", e.target.value)}
                required
                className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-base focus:outline-none focus:border-[#007ACC] focus:ring-4 focus:ring-[#007ACC]/20 transition-all duration-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-4 p-1 text-zinc-500 hover:text-[#007ACC] hover:bg-[#007ACC]/10 rounded bg-transparent border-none cursor-pointer transition-colors"
              >
                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {formData.newPassword && (
              <div className="mt-2">
                <div className="flex gap-1.5 h-1 mb-1.5">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex-1 rounded-full transition-colors duration-300",
                        i <= passwordStrength ? getStrengthColor(passwordStrength) : "bg-zinc-200 dark:bg-zinc-700"
                      )}
                    />
                  ))}
                </div>
                <div className={cn("text-xs font-medium", getStrengthTextColor(passwordStrength))}>
                  Força da senha: {getStrengthText(passwordStrength)}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirmPassword" className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              Confirmar Nova Senha
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4 text-zinc-500 z-10 pointer-events-none">
                <Lock size={16} />
              </div>
              <input
                id="confirmPassword"
                type={showPasswords.confirm ? "text" : "password"}
                placeholder="Confirme sua nova senha"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange("confirmPassword", e.target.value)
                }
                required
                className="w-full pl-12 pr-12 py-3 rounded-xl border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-base focus:outline-none focus:border-[#007ACC] focus:ring-4 focus:ring-[#007ACC]/20 transition-all duration-300 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-4 p-1 text-zinc-500 hover:text-[#007ACC] hover:bg-[#007ACC]/10 rounded bg-transparent border-none cursor-pointer transition-colors"
              >
                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-2 sm:flex-row flex-col">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading ? "Alterando..." : "Alterar Senha"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
