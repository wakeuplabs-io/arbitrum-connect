import { hc } from "hono/client";
import { AppType } from "../../../api/src/app";

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
  chains: {
    getAllPublic: async () => {
      const res = await client.api.chains.chains.list.$get();

      if (!res.ok) {
        throw new Error("Failed to get all public chains");
      }

      const data = await res.json();

      return data;
    },
    getAllUserChains: async (userAddress: string) => {
      const res = await client.api.chains.chains.list.user.$get({
        query: { userAddress },
      });

      if (!res.ok) {
        throw new Error("Failed to get user chains");
      }

      const data = await res.json();

      return data;
    },
    getByChainId: async (chainId: number) => {
      const res = await client.api.chains.chains.get[":id"].$get({
        param: { id: chainId.toString() },
      });

      if (!res.ok) {
        throw new Error("Failed to get chain");
      }

      const data = await res.json();

      return data;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    create: async (chain: any) => {
      const res = await client.api.chains.chains.create.$post({
        json: chain,
      });

      if (!res.ok) {
        throw new Error("Failed to create chain");
      }

      const data = await res.json();

      return data;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    edit: async (chain: any) => {
      const res = await client.api.chains.chains.update.$put({
        json: {
          ...chain,
          userAddress: chain.user,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to edit chain");
      }

      const data = await res.json();

      return data;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setFeatured: async (chainId: number, featured: boolean) => {
      const res = await client.api.chains.chains["set-featured"].$put({
        json: { chainId, featured },
      });

      if (!res.ok) {
        throw new Error("Failed to set featured chain");
      }

      const data = await res.json();

      return data;
    },
    delete: async (chainId: number) => {
      const res = await client.api.chains.chains.delete[":chainId"].$delete({
        param: { chainId: chainId.toString() },
      });

      if (!res.ok) {
        throw new Error("Failed to delete chain");
      }

      const data = await res.json();
      return data;
    },
  },
};
