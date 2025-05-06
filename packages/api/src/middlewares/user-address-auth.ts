import { Context, Next } from "hono";
import { ByteArray, recoverMessageAddress, Signature } from "viem";
import * as HttpStatusCodes from "stoker/http-status-codes";

export async function userAddressAuthMiddleware(c: Context, next: Next) {
  const sig = c.req.header("x-signature") as `0x${string}` | ByteArray | Signature;
  const payload = c.req.header("x-payload");
  if (!sig || !payload) {
    return c.json({ error: "Missing signature or payload" }, HttpStatusCodes.BAD_REQUEST);
  }

  let address: `0x${string}`;
  try {
    address = await recoverMessageAddress({ message: payload, signature: sig });
  } catch {
    return c.json({ error: "Invalid signature" }, HttpStatusCodes.UNAUTHORIZED);
  }

  c.set("userAddress", address);

  return next();
}
