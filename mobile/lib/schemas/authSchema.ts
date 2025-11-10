import { z } from "zod";

const requiredError = "To pole jest wymagane";

export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(1, requiredError)
      .min(3, "Nazwa użytkownika musi mieć co najmniej 3 znaki"),
    email: z
      .string()
      .trim()
      .min(1, requiredError)
      .email("Nieprawidłowy adres email"),
    password: z
      .string()
      .min(1, requiredError)
      .min(8, "Hasło musi mieć co najmniej 8 znaków"),
    confirmPassword: z.string().min(1, requiredError),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Hasła nie są identyczne",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  username: z.string().trim().min(1, requiredError),
  password: z.string().min(1, requiredError),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
export type LoginFormValues = z.infer<typeof loginSchema>;
