import { z } from "zod";

// NOTE: DO NOT destructure process.env
const env = {
  HTTPS_ETH_RPC_URL: import.meta.env.VITE_HTTPS_ETH_RPC_URL,
  HTTPS_ARB_RPC_URL: import.meta.env.VITE_HTTPS_ARB_RPC_URL,
  IS_TESTNET: import.meta.env.VITE_IS_TESTNET,
  RESERCH_LINK_URL: import.meta.env.VITE_RESERCH_LINK_URL,
};

const envSchema = z
  .object({
    IS_TESTNET: z.string().transform((value) => value.toLowerCase() === "true"),
    HTTPS_ETH_RPC_URL: z.string().url(),
    HTTPS_ARB_RPC_URL: z.string().url(),
    RESERCH_LINK_URL: z.string().url(),
  })
  .required();

const envParsed = () => envSchema.parse(env);

export default envParsed;
