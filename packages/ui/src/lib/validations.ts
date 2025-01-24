import { Address, isAddress } from "viem";
import { z } from "zod";

export const optionalAddress = z
  .string()
  .optional()
  .refine((x) => !x || isAddress(x), { message: "ADDRESS_INVALID" })
  .transform((x) => x as Address);

export const requiredAddress = z
  .string()
  .refine((x) => isAddress(x), { message: "ADDRESS_INVALID" })
  .transform((x) => x as Address);