import { hc } from "hono/client";
import { AppType } from "../../../api/src/app";
import { Transaction } from "@/lib/transactions";
import { Address } from "viem";
import { ClaimStatus } from "@/hooks/use-arbitrum-bridge";
import { CustomChain } from "@/types";
import envParsed from "@/envParsed";
import { AuthenticatedApiClient } from "@/hooks/use-api-client";

const API_URL = envParsed().API_URL;
const client = hc<AppType>(API_URL);

// Define interface for API transaction response
interface ApiTransaction {
  bridgeHash: string;
  amount: string;
  claimStatus: string;
  parentChainId: number;
  childChainId: number;
  account?: string;
  delayedInboxHash?: string | null;
  delayedInboxTimestamp?: number | null;
}

// Helper function to map API transaction to Transaction type
const mapApiTransactionToTransaction = (item: ApiTransaction): Transaction => {
  // Ensure claimStatus is a valid enum value
  let claimStatus: ClaimStatus;
  if (item.claimStatus === "PENDING") {
    claimStatus = ClaimStatus.PENDING;
  } else if (item.claimStatus === "CLAIMABLE") {
    claimStatus = ClaimStatus.CLAIMABLE;
  } else if (item.claimStatus === "CLAIMED") {
    claimStatus = ClaimStatus.CLAIMED;
  } else {
    claimStatus = ClaimStatus.PENDING; // Default fallback
  }

  return {
    ...item,
    bridgeHash: item.bridgeHash as Address,
    delayedInboxHash: item.delayedInboxHash
      ? (item.delayedInboxHash as Address)
      : undefined,
    account: item.account as Address | undefined,
    delayedInboxTimestamp: item.delayedInboxTimestamp ?? undefined,
    claimStatus,
  };
};

export const api = {
  users: {
    create: async (address: string) => {
      const res = await client.api.users.users.create.$post({
        json: { address },
      });

      if (!res.ok) {
        throw new Error("Failed to create/get user");
      }

      return res.json();
    },
    get: async (client: AuthenticatedApiClient, address: string) => {
      const res = await client.api.users.users.get[":address"].$get({
        param: { address },
      });

      return res.json();
    },
  },
  chains: {
    getAllPublicChains: async () => {
      const res = await client.api.chains.chains.list.$get();

      if (!res?.ok) {
        throw new Error("Failed to get all public chains");
      }

      const data = await res.json();

      return data.map((chain) => ({
        ...chain,
        chainId: parseInt(chain.chainId),
      }));
    },
    getAllUserChains: async () => {
      const userAddress = localStorage.getItem("last-wallet-address") as Address

      const res = await client.api.chains.chains.list.user.$get({
        query: { userAddress },
      });

      if (!res.ok) {
        throw new Error("Failed to get user chains");
      }

      const data = await res.json();

      return data.map((chain) => ({
        ...chain,
        chainId: parseInt(chain.chainId),
      }));
    },
    getByChainId: async (
      chainId: number,
      userAddress: Address
    ): Promise<CustomChain> => {
      const res = await client.api.chains.chains.get[":id"].$get({
        param: { id: chainId.toString() },
        query: { userAddress },
      });

      if (!res.ok) {
        throw new Error("Failed to get chain");
      }

      const data = await res.json();

      return {
        ...data,
        chainId: parseInt(data.chainId, 10),
      } as CustomChain;
    },
    create: async (clientWithAuth: AuthenticatedApiClient, chain: CustomChain) => {
      const res = await clientWithAuth.api.chains.chains.create.$post({
        json: {
          ...chain,
          userAddress: chain.user as string,
          logoURI: chain.logoURI ?? null,
          chainId: chain.chainId.toString(),
          tokenBridge: chain.tokenBridge,
        }
      });

      if (!res.ok) {
        throw new Error("Failed to create chain");
      }

      const data = await res.json();

      return data;
    },
    edit: async (clientWithAuth: AuthenticatedApiClient, chain: CustomChain) => {
      const res = await clientWithAuth.api.chains.chains.update.$put({
        json: {
          ...chain,
          userAddress: chain.user as string,
          chainId: chain.chainId.toString(),
          logoURI: chain.logoURI ?? null,
          tokenBridge: chain.tokenBridge,
        }
      });

      if (!res.ok) {
        throw new Error("Failed to edit chain");
      }

      const data = await res.json();

      return {
        ...data,
        chainId: parseInt(data.chainId),
      };
    },
    setFeatured: async (clientWithAuth: AuthenticatedApiClient,
      chainId: number,
      featured: boolean
    ) => {
      const res = await clientWithAuth.api.chains.chains["set-featured"].$put({
        json: { chainId: chainId.toString(), featured }
      });

      if (!res.ok) {
        throw new Error("Failed to set featured chain");
      }

      const data = await res.json();

      return {
        ...data,
        chainId: parseInt(data.chainId),
      };
    },
    delete: async (clientWithAuth: AuthenticatedApiClient, chainId: number) => {
      const res = await clientWithAuth.api.chains.chains.delete.$delete({
        json: {
          chainId: chainId.toString(),
        },
      });

      if (!res.ok) {
        throw new Error("Failed to delete chain");
      }

      const data = await res.json();
      return data;
    },
  },
  transactions: {
    getByAccount: async (account: string): Promise<Transaction[]> => {
      const res = await client.api.transactions.transactions.account[
        ":account"
      ].$get({
        param: { account },
      });

      if (!res.ok) {
        throw new Error("Failed to get transactions by account");
      }

      const data = await res.json();

      // Map the API response to match the Transaction type
      return data.map(mapApiTransactionToTransaction);
    },
    getByBridgeHash: async (
      bridgeHash: string
    ): Promise<Transaction | null> => {
      const res = await client.api.transactions.transactions[
        ":bridgeHash"
      ].$get({
        param: { bridgeHash },
      });

      if (!res.ok) {
        throw new Error("Failed to get transaction by bridge hash");
      }

      const data = await res.json();

      return mapApiTransactionToTransaction(data);
    },
    create: async (transaction: Transaction): Promise<Transaction> => {
      const res = await client.api.transactions.transactions.$post({
        json: {
          ...transaction,
          userAddress: transaction.account as Address,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to create transaction");
      }

      const data = await res.json();

      return mapApiTransactionToTransaction(data);
    },
    update: async (transaction: Transaction): Promise<Transaction> => {
      const res = await client.api.transactions.transactions[
        ":bridgeHash"
      ].$patch({
        json: {
          ...transaction,
        },
        param: { bridgeHash: transaction.bridgeHash },
      });
      if (!res.ok) {
        throw new Error("Failed to update transaction");
      }

      const data = await res.json();

      return mapApiTransactionToTransaction(data);
    },
  },
};
