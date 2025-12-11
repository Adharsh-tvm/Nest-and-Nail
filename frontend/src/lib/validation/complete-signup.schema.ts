import { z } from "zod";

export const CompleteSignupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["client", "worker"]),
  otp: z.string().min(4).max(6)
});

export type CompleteSignupInput = z.infer<typeof CompleteSignupSchema>;
