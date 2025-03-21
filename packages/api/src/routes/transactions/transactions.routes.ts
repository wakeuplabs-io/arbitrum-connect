import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";
import { notFoundSchema } from "../../lib/constants";
import {
  TransactionSchema,
  CreateTransactionSchema,
  UpdateTransactionSchema,
} from "./transactions.schema";

const tags = ["Transactions"];

export const getTransactions = createRoute({
  path: "/transactions/list",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(TransactionSchema),
      "A list of transactions"
    ),
  },
});

export const getTransactionsByAddress = createRoute({
  path: "/transactions/address/:address",
  method: "get",
  request: {
    params: z.object({
      address: z.string(),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(TransactionSchema),
      "A list of transactions"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Transactions not found"
    ),
  },
});

export const getTransaction = createRoute({
  path: "/transactions/:bridgeHash",
  method: "get",
  request: {
    params: z.object({
      bridgeHash: z.string(),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      TransactionSchema,
      "A single transaction"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Transaction not found"
    ),
  },
});

export const createTransaction = createRoute({
  path: "/transactions",
  method: "post",
  request: {
    body: jsonContentRequired(
      CreateTransactionSchema,
      "The transaction to create"
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      TransactionSchema,
      "The created transaction"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(CreateTransactionSchema),
      "Invalid transaction data"
    ),
  },
});

export const updateTransaction = createRoute({
  path: "/transactions/:bridgeHash",
  method: "patch",
  request: {
    params: z.object({
      bridgeHash: z.string(),
    }),
    body: jsonContentRequired(
      UpdateTransactionSchema,
      "The transaction update data"
    ),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      TransactionSchema,
      "The updated transaction"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Transaction not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(UpdateTransactionSchema),
      "Invalid update data"
    ),
  },
});

export type GetTransactionsRoute = typeof getTransactions;
export type GetTransactionRoute = typeof getTransaction;
export type CreateTransactionRoute = typeof createTransaction;
export type UpdateTransactionRoute = typeof updateTransaction;
export type GetTransactionsByAddressRoute = typeof getTransactionsByAddress;
