import { z } from "zod";

// Schemat dla logowania
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email jest wymagany")
    .email("Niepoprawny format emaila"),
  password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
});

// Schemat dla rejestracji
export const registerSchema = z
  .object({
    username: z.string().min(1, "Nazwa użytkownika jest wymagana"),
    email: z
      .string()
      .min(1, "Email jest wymagany")
      .email("Niepoprawny format emaila"),
    password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
    confirmPassword: z.string().min(6, "Potwierdzenie hasła jest wymagane"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są takie same",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
