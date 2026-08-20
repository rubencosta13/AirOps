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
