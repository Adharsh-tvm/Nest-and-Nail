import { z } from "zod";

export const LoginSchema = z.object({
  email_address: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password is required")
});

export type LoginInput = z.infer<typeof LoginSchema>;
