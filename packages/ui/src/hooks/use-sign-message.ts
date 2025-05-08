import { useMemo } from "react";
import { useSignMessage } from "wagmi";

export type HonoFetch = (
  input: URL | RequestInfo,
  init?: RequestInit,
  env?: any,
  executionCtx?: any
) => Promise<Response>;

export function useSignedFetch() {
  const { signMessageAsync } = useSignMessage();

  const signedFetch = useMemo(
    () =>
      createSignedFetch((payload: string) =>
        signMessageAsync({ message: payload })
      ),
    [signMessageAsync]
  );

  return signedFetch;
}

export function createSignedFetch(
  signMessage: (payload: string) => Promise<string>,
  baseFetch: HonoFetch = fetch as unknown as HonoFetch
): HonoFetch {
  return async (input, init = {}, env?, executionCtx?) => {
    let url: string;
    if (typeof input === "string") {
      url = input;
    } else if (input instanceof URL) {
      url = input.toString();
    } else {
      url = input.url;
    }

    const method = (init.method ?? "GET").toUpperCase();

    let bodyObj: unknown = null;
    if (typeof init.body === "string") {
      try {
        bodyObj = JSON.parse(init.body);
      } catch {
        bodyObj = init.body;
      }
    }

    const payload = JSON.stringify({ path: url, method, body: bodyObj });
    const signature = await signMessage(payload);

    const headers = new Headers(init.headers);
    headers.set("Content-Type", "application/json");
    headers.set("X-Payload", payload);
    headers.set("X-Signature", signature);

    // 6. Call the underlying fetch (env & executionCtx are ignored here)
    return baseFetch(input, { ...init, headers }, env, executionCtx);
  };
}
