import { z } from "zod";

// NOTE: DO NOT destructure process.env
const env = {
  IS_TESTNET: import.meta.env.VITE_IS_TESTNET,
  RESERCH_LINK_URL: import.meta.env.VITE_RESERCH_LINK_URL,
  API_URL: import.meta.env.VITE_API_URL
};

const envSchema = z
  .object({
    IS_TESTNET: z.string().transform((value) => value.toLowerCase() === "true"),
    RESERCH_LINK_URL: z.string().url(),
    API_URL: z.string().url()
  })
  .required();

const envParsed = () => envSchema.parse(env);

export default envParsed;
