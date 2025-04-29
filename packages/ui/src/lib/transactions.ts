import { ClaimStatus } from "@/hooks/use-arbitrum-bridge";
import { Address } from "viem";

export interface Transaction {
  bridgeHash: Address;
  amount: string;
  delayedInboxTimestamp?: number;
  delayedInboxHash?: Address;
  claimStatus: ClaimStatus;
  account?: Address;
}

export class TransactionsStorageService {
  constructor(private readonly storageKey: string) {}

  getAll(): Transaction[] {
    return JSON.parse(localStorage.getItem(this.storageKey) ?? "[]");
  }

  getByAccount(account: Address): Transaction[] {
    return JSON.parse(localStorage.getItem(this.storageKey) ?? "[]").filter(
      (tx: Transaction) => tx.account === account
    );
  }

  getByBridgeHash(hash: Address): Transaction | null {
    return (
      this.getAll().find(
        (t) => t.bridgeHash.toLowerCase() === hash.toLowerCase()
      ) ?? null
    );
  }

  //TODO: improve this, could we split by account ?
  create(tx: Transaction, account: Address): void {
    const txs = this.getAll();
    txs.push({ ...tx, account: account });
    localStorage.setItem(this.storageKey, JSON.stringify(txs));
  }

  update(tx: Transaction): void {
    const txs = this.getAll();
    const txToUpdateIndex = txs.findIndex((x) => x.bridgeHash == tx.bridgeHash);
    txs[txToUpdateIndex] = { ...txs[txToUpdateIndex], ...tx };
    localStorage.setItem(this.storageKey, JSON.stringify([...txs]));
  }
}

export const transactionsStorageService = new TransactionsStorageService(
  "transactions"
);
