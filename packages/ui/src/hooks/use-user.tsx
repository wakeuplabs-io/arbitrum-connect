import { useEffect } from "react";
import { useAccount } from "wagmi";
import { api } from "@/services/api";

export function useUser() {
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected && address) {
      api.users.create(address).catch(console.error);
    }
  }, [address, isConnected]);

  return { createOrGetUser: api.users.create, getUser: api.users.get };
}
