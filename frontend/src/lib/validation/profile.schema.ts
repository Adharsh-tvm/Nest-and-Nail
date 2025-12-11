import { z } from "zod";

export const ProfileSchema = z.object({
  user_name: z.string().min(2),
  phone_number: z.string().min(10).max(15),
  address: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional()
});

export type ProfileInput = z.infer<typeof ProfileSchema>;
