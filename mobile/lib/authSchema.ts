import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email jest wymagany")
    .email("Niepoprawny format emaila"),
  password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
