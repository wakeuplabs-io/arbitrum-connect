import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import { AppRouteHandler } from "../../lib/types";
import {
  CreateTransactionRoute,
  UpdateTransactionRoute,
  GetTransactionByAccountRoute,
  GetTransactionByBridgeHashRoute,
} from "./transactions.routes";
import { prisma, Transaction } from "db";
import { TransactionSchema } from "./transactions.schema";

// Helper function to convert BigInt to number in transaction data
const convertBigIntToNumber = (transaction: Transaction) => {
  if (transaction.delayedInboxTimestamp) {
    return {
      ...transaction,
      delayedInboxTimestamp: Number(transaction.delayedInboxTimestamp),
    };
  }
  return transaction;
};

export const getTransactionByAccount: AppRouteHandler<
  GetTransactionByAccountRoute
> = async (c) => {
  const { account } = c.req.valid("param");
  const transactions = await prisma.transaction.findMany({
    where: { userAddress: account },
    include: { user: true },
  });

  // Convert BigInt to number in all transactions
  const processedTransactions = transactions.map(convertBigIntToNumber);

  return c.json(
    processedTransactions.map((transaction) =>
      TransactionSchema.parse(transaction)
    ),
    HttpStatusCodes.OK
  );
};

export const getTransactionByBridgeHash: AppRouteHandler<
  GetTransactionByBridgeHashRoute
> = async (c) => {
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

  // Convert BigInt to number
  const processedTransaction = convertBigIntToNumber(transaction);

  return c.json(
    TransactionSchema.parse(processedTransaction),
    HttpStatusCodes.OK
  );
};

export const createTransaction: AppRouteHandler<
  CreateTransactionRoute
> = async (c) => {
  const data = c.req.valid("json");

  const transaction = await prisma.transaction.create({
    data: {
      bridgeHash: data.bridgeHash,
      amount: data.amount,
      claimStatus: data.claimStatus,
      parentChainId: data.parentChainId,
      childChainId: data.childChainId,
      account: data.account || "",
      userAddress: data.userAddress,
    },
    include: { user: true },
  });

  // Convert BigInt to number
  const processedTransaction = convertBigIntToNumber(transaction);

  return c.json(
    TransactionSchema.parse(processedTransaction),
    HttpStatusCodes.CREATED
  );
};

export const updateTransaction: AppRouteHandler<
  UpdateTransactionRoute
> = async (c) => {
  const { bridgeHash } = c.req.valid("param");
  const data = c.req.valid("json");

  const transaction = await prisma.transaction.update({
    where: { bridgeHash },
    data,
  });

  // Convert BigInt to number
  const processedTransaction = convertBigIntToNumber(transaction);

  return c.json(
    TransactionSchema.parse(processedTransaction),
    HttpStatusCodes.OK
  );
};
