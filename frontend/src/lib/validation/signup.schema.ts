import { z } from "zod";

export const SignupStartSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Name must be at least 2 characters"),

  email: z.string()
    .trim()
    .email({ message: "Invalid email format" }),

  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must include at least one uppercase letter")
    .regex(/[a-z]/, "Must include at least one lowercase letter")
    .regex(/[0-9]/, "Must include at least one number")
    .regex(/[@$!%*?&]/, "Must include at least one special character"),

  confirmPassword: z.string(),

  role: z.enum(["client", "worker"]),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});
