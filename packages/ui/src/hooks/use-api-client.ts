import envParsed from "@/envParsed";
import { hc } from "hono/client";
import { AppType } from "../../../api/src/app";
import { useSignedFetch } from "./use-sign-message";

export function useApiClient() {
    const API_URL = envParsed().API_URL;
    const signedFetch = useSignedFetch();

    const client = hc<AppType>(API_URL, { fetch: signedFetch });
    return client;
}

export type AuthenticatedApiClient = ReturnType<typeof useApiClient>;