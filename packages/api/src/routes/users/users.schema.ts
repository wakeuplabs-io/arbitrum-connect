import { z } from "@hono/zod-openapi";

export const UserSchema = z.object({
  id: z.string().uuid(),
  address: z.string(),
});

export const CreateUserSchema = UserSchema.omit({ id: true });

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
