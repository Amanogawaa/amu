import { z } from "zod";

export const AUTHSCHEMA = z.object({
  email: z.email({ error: "Invalid email" }),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters long" })
    .regex(/[a-zA-Z]/, { error: "Password must contain at least one letter" })
    .regex(/[0-9]/, { error: "Password must contain at least one number" }),
});

export type AuthFormData = z.infer<typeof AUTHSCHEMA>;

export type AuthState = {
  data: object | null;
  errors: { email?: string; password?: string; general?: string } | null;
};
