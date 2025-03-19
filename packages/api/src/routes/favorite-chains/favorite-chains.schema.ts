import { z } from "@hono/zod-openapi";

export const UserFavoriteChainSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  chainId: z.string().uuid(),
  createdAt: z.date(),
  // Include relationships for the response
  chain: z.object({
    id: z.string().uuid(),
    name: z.string(),
    chainId: z.number().int(),
    logoURI: z.string().nullable(),
  }),
});

// Schema for creating/deleting favorites
export const ToggleFavoriteChainSchema = z.object({
  userId: z.string().uuid(),
  chainId: z.string().uuid(),
});

export type UserFavoriteChain = z.infer<typeof UserFavoriteChainSchema>;
export type ToggleFavoriteChain = z.infer<typeof ToggleFavoriteChainSchema>;
