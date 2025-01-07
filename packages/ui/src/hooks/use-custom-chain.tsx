import { CustomChain } from "@/types";
import { useEffect, useState } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";

export default function useCustomChain() {
  const { address } = useAccount();
  const [chains, setChains] = useState<CustomChain[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;
    // Fetch chains for the user
    getUserChains(address);
  }, [address]);

  const createChain = (userAddress: Address, chain: CustomChain) => {
    const storedChains = localStorage.getItem(`chains_${userAddress}`);
    const parsedChains: CustomChain[] = storedChains ? JSON.parse(storedChains) : [];
    parsedChains.push(chain);
    localStorage.setItem(`chains_${userAddress}`, JSON.stringify(parsedChains));
    setChains(parsedChains);
  };

  const deleteChain = (userAddress: Address, chainId: number) => {
    const storedChains = localStorage.getItem(`chains_${userAddress}`);
    if (!storedChains) return [];
    const parsedChains: CustomChain[] = JSON.parse(storedChains).filter((chain : CustomChain)  => chain.chainId !== chainId);
    localStorage.setItem(`chains_${userAddress}`, JSON.stringify(parsedChains));
    setChains(parsedChains);
  };

  const getUserChains = (userAddress: Address) => {
    setLoading(true);
    const storedChains = localStorage.getItem(`chains_${userAddress}`);
    const parsedChains: CustomChain[] = storedChains ? JSON.parse(storedChains) : [];
    setChains(parsedChains);
    setLoading(false);
  };

  return { createChain, deleteChain, getUserChains, chains, loading };
}
