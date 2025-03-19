import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { AppRouteHandler } from "../../lib/types";
import {
  GetTransactionsRoute,
  GetTransactionRoute,
  CreateTransactionRoute,
  UpdateTransactionRoute,
} from "./transactions.routes";
import { prisma } from "db";
import { TransactionSchema } from "./transactions.schema";

export const getTransactions: AppRouteHandler<GetTransactionsRoute> = async (
  c
) => {
  const transactions = await prisma.transaction.findMany({
    include: { user: true },
  });
  return c.json(
    transactions.map((transaction) => TransactionSchema.parse(transaction)),
    HttpStatusCodes.OK
  );
};

export const getTransaction: AppRouteHandler<GetTransactionRoute> = async (
  c
) => {
  const { bridgeHash } = c.req.valid("param");
  const transaction = await prisma.transaction.findUnique({
    where: { bridgeHash },
    include: { user: true },
  });

  if (!transaction) {
    return c.json(
      { message: HttpStatusPhrases.NOT_FOUND },
      HttpStatusCodes.NOT_FOUND
    );
  }

  return c.json(TransactionSchema.parse(transaction), HttpStatusCodes.OK);
};

export const createTransaction: AppRouteHandler<
  CreateTransactionRoute
> = async (c) => {
  const data = c.req.valid("json");
  const transaction = await prisma.transaction.create({
    data,
    include: { user: true },
  });
  return c.json(TransactionSchema.parse(transaction), HttpStatusCodes.CREATED);
};

export const updateTransaction: AppRouteHandler<
  UpdateTransactionRoute
> = async (c) => {
  const { bridgeHash } = c.req.valid("param");
  const data = c.req.valid("json");

  const transaction = await prisma.transaction.update({
    where: { bridgeHash },
    data: { claimStatus: data.claimStatus },
    include: { user: true },
  });

  return c.json(TransactionSchema.parse(transaction), HttpStatusCodes.OK);
};
