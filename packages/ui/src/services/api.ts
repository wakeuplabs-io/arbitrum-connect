import { hc } from "hono/client";
import { AppType } from "../../../api/src/app";
import { Transaction } from "@/lib/transactions";

const API_URL = import.meta.env.VITE_API_URL;
const client = hc<AppType>(API_URL);

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
    get: async (address: string) => {
      const res = await client.api.users.users.get[":address"].$get({
        param: { address },
      });

      return res.json();
    },
  },
  transactions: {
    create: async (tx: Transaction) => {
      const payload = {
        ...tx,
        userAddress: tx.userAddress.toString(),
      };
      const res = await client.api.transactions.transactions.$post({
        json: payload,
      });
      return res.json();
    },
    getByAddress: async (address: string) => {
      const res = await client.api.transactions.transactions.address[
        ":address"
      ].$get({
        param: { address },
      });

      return res.json();
    },
    getByBridgeHash: async (bridgeHash: string) => {
      const res = await client.api.transactions.transactions[
        ":bridgeHash"
      ].$get({
        param: { bridgeHash },
      });

      return res.json();
    },
    update: async (tx: Transaction) => {
      const res = await client.api.transactions.transactions[
        ":bridgeHash"
      ].$patch({
        param: { bridgeHash: tx.bridgeHash },
        json: tx,
      });
      return res.json();
    },
  },
  chains: {
    // Chain-related methods
  },
};
