import { z } from "@hono/zod-openapi";

// Base schema for transactions
export const TransactionSchema = z.object({
  id: z.string().uuid(),
  bridgeHash: z.string(),
  amount: z.string(),
  claimStatus: z.string().default("PENDING"),
  parentChainId: z.number().int(),
  childChainId: z.number().int(),
  account: z.string(),
  userId: z.string().uuid(),
  createdAt: z.date(),
  // Include user relationship
  user: z.object({
    id: z.string().uuid(),
    address: z.string(),
  }),
});

// Schema for creating a new transaction
export const CreateTransactionSchema = TransactionSchema.omit({
  id: true,
  createdAt: true,
  user: true,
});

// Schema for updating transaction status
export const UpdateTransactionSchema = z.object({
  claimStatus: z.string(),
});

// Types exported for use in routes
export type Transaction = z.infer<typeof TransactionSchema>;
export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransaction = z.infer<typeof UpdateTransactionSchema>;
