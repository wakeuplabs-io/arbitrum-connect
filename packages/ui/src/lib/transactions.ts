import { ClaimStatus } from "@/hooks/use-arbitrum-bridge";
import { api } from "@/services/api";
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
}

export class TransactionsStorageService {
  static async getByAccount(account: Address): Promise<Transaction[]> {
    const transactions = await api.transactions.getByAccount(account);

    return transactions;
  }

  static async getByBridgeHash(hash: Address): Promise<Transaction | null> {
    const transaction = await api.transactions.getByBridgeHash(hash);
    return transaction;
  }

  static async create(tx: Transaction, account: Address): Promise<void> {
    await api.transactions.create({ ...tx, account });
  }

  static async update(tx: Transaction): Promise<void> {
    await api.transactions.update(tx);
  }
}
