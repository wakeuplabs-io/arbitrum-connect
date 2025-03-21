import { db } from "@/db/db";
import { ClaimStatus } from "@/hooks/use-arbitrum-bridge";
import { Address } from "viem";

export interface Transaction {
  bridgeHash: Address;
  amount: string;
  delayedInboxTimestamp?: number;
  delayedInboxHash?: Address;
  claimStatus: ClaimStatus;
  account?: Address;
  parentChainId: number;
  childChainId: number;
  userAddress: Address;
}

export class TransactionsStorageService {
  static async getByAccount(account: Address): Promise<Transaction[]> {
    const transactions = await db.transactions
      .where("account")
      .equals(account)
      .toArray();

    return transactions;
  }

  static async getByBridgeHash(hash: Address): Promise<Transaction | null> {
    const transaction = await db.transactions
      .where("bridgeHash")
      .equals(hash)
      .first();
    return transaction || null;
  }

  static async create(tx: Transaction, account: Address): Promise<void> {
    await db.transactions.add({ ...tx, account });
  }

  static async update(tx: Transaction): Promise<void> {
    await db.transactions.update(tx.bridgeHash, { ...tx });
  }
}
