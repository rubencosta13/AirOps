import z from "zod";

export const signInSchema = z.object({
  email: z.email().nonempty(),
  password: z.string().nonempty(),
});

export type SignInSchema = z.infer<typeof signInSchema>;

export const signUpSchema = z.object({
  name: z.string().nonempty(),
  email: z.email().nonempty(),
  password: z.string().nonempty(),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const forgotPasswordSchema = z.object({
  email: z.email().nonempty(),
});

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  password: z.string().nonempty(),
  token: z.string().nonempty(),
});

export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export const verifyAccountSchema = z.object({
  token: z.string().nonempty(),
});

export type VerifyAccountSchema = z.infer<typeof verifyAccountSchema>;
