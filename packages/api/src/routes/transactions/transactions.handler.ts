import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { AppRouteHandler } from "../../lib/types";
import {
  GetTransactionsRoute,
  GetTransactionRoute,
  CreateTransactionRoute,
  UpdateTransactionRoute,
  GetTransactionsByAddressRoute,
} from "./transactions.routes";
import { prisma } from "db";
import { TransactionSchema } from "./transactions.schema";
import { CreateTransactionSchema } from "./transactions.schema";

export const getTransactions: AppRouteHandler<GetTransactionsRoute> = async (
  c
) => {
  const transactions = await prisma.transaction.findMany({
    include: { user: true },
  });

  return c.json(
    transactions.map((transaction) =>
      TransactionSchema.parse({
        ...transaction,
        userAddress: transaction.account,
      })
    ),
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

  const mappedTransaction = {
    ...transaction,
    userAddress: transaction.account,
  };

  return c.json(TransactionSchema.parse(mappedTransaction), HttpStatusCodes.OK);
};

export const getTransactionsByAddress: AppRouteHandler<
  GetTransactionsByAddressRoute
> = async (c) => {
  const { address } = c.req.valid("param");
  const transactions = await prisma.transaction.findMany({
    where: { user: { address } },
    include: { user: true },
  });

  return c.json(
    transactions.map((transaction) =>
      TransactionSchema.parse({
        ...transaction,
        userAddress: transaction.account,
      })
    ),
    HttpStatusCodes.OK
  );
};

export const createTransaction: AppRouteHandler<
  CreateTransactionRoute
> = async (c) => {
  const rawData = await c.req.json();

  const validatedData = CreateTransactionSchema.parse(rawData);

  const transaction = await prisma.transaction.create({
    data: {
      bridgeHash: validatedData.bridgeHash,
      amount: validatedData.amount,
      claimStatus: validatedData.claimStatus,
      parentChainId: validatedData.parentChainId,
      childChainId: validatedData.childChainId,
      account: validatedData.userAddress,
      user: {
        connect: { address: validatedData.userAddress },
      },
    },
    include: { user: true },
  });

  const response = {
    ...transaction,
    userAddress: transaction.account,
  };

  return c.json(response, HttpStatusCodes.CREATED);
};

export const updateTransaction: AppRouteHandler<
  UpdateTransactionRoute
> = async (c) => {
  const { bridgeHash } = c.req.valid("param");
  const data = c.req.valid("json");

  const transaction = await prisma.transaction.update({
    where: { bridgeHash },
    data: {
      bridgeHash: data.bridgeHash,
      amount: data.amount,
      claimStatus: data.claimStatus,
      parentChainId: data.parentChainId,
      childChainId: data.childChainId,
      account: data.userAddress,
      delayedInboxHash: data.delayedInboxHash,
      delayedInboxTimestamp: data.delayedInboxTimestamp,
    },
    include: { user: true },
  });

  const response = {
    ...transaction,
    userAddress: transaction.account,
  };

  return c.json(TransactionSchema.parse(response), HttpStatusCodes.OK);
};
