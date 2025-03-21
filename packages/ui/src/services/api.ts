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
};
