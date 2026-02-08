import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().min(1, "Email é obrigatório").email("Formato de email inválido"),
    password: z.string().min(1, "Senha é obrigatória"),
});

export const registerSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório").min(3, "Nome deve ter pelo menos 3 caracteres"),
    email: z.string().min(1, "Email é obrigatório").email("Formato de email inválido"),
    password: z
        .string()
        .min(1, "Senha é obrigatória")
        .min(6, "A senha deve ter no mínimo 6 caracteres")
        .regex(/[A-Z]/, "Deve conter pelo menos uma letra maiúscula")
        .regex(/[a-z]/, "Deve conter pelo menos uma letra minúscula")
        .regex(/[0-9]/, "Deve conter pelo menos um número"),
    confirmPassword: z.string().min(1, "Confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;
