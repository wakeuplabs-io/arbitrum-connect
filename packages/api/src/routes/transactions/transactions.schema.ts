import { z } from "@hono/zod-openapi";

// Base schema for transactions
export const TransactionSchema = z.object({
  bridgeHash: z.string(),
  amount: z.string(),
  claimStatus: z.string(),
  account: z.string().optional(),
  delayedInboxTimestamp: z.number().nullable(),
  delayedInboxHash: z.string().nullable(),
  parentChainId: z.number().int(),
  childChainId: z.number().int(),
});

// Schema for creating a new transaction
export const CreateTransactionSchema = z.object({
  bridgeHash: z.string(),
  amount: z.string(),
  claimStatus: z.string().default("PENDING"),
  parentChainId: z.number().int(),
  childChainId: z.number().int(),
  account: z.string().optional(),
  userAddress: z.string(),
});

// Schema for updating transaction status
export const UpdateTransactionSchema = z.object({
  bridgeHash: z.string(),
  amount: z.string(),
  claimStatus: z.string(),
  parentChainId: z.number().int(),
  childChainId: z.number().int(),
  account: z.string().optional(),
  delayedInboxTimestamp: z.number().optional(),
  delayedInboxHash: z.string().optional(),
});

// Types exported for use in routes
export type Transaction = z.infer<typeof TransactionSchema>;
export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransaction = z.infer<typeof UpdateTransactionSchema>;
