import { z } from "zod";

export const OtpSchema = z.object({
    email_address: z.string().email("Invalid email"),
    user_role: z.enum(["CLIENT", "WORKER", "ADMIN"], {
        message: "User role is required"
    })

});

export type OtpInput = z.infer<typeof OtpSchema>;
