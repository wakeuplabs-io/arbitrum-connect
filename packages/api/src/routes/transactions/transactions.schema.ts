import { z } from "@hono/zod-openapi";

// Schema base para las transacciones
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
  // Incluimos la relación con el usuario
  user: z.object({
    id: z.string().uuid(),
    address: z.string(),
  }),
});

// Schema para crear una nueva transacción
export const CreateTransactionSchema = TransactionSchema.omit({
  id: true,
  createdAt: true,
  user: true,
});

// Schema para actualizar el estado de una transacción
export const UpdateTransactionSchema = z.object({
  claimStatus: z.string(),
});

// Tipos exportados para uso en las rutas
export type Transaction = z.infer<typeof TransactionSchema>;
export type CreateTransaction = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransaction = z.infer<typeof UpdateTransactionSchema>;
