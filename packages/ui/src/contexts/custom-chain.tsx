import { createContext, useState, ReactNode } from "react";
import { CustomChain } from "@/types";
import { Address } from "viem";

type CustomChainContextType = {
  chains: CustomChain[];
  loading: boolean;
  createChain: (userAddress: Address, chain: CustomChain) => void;
  deleteChain: (userAddress: Address, chainId: number) => void;
  getUserChains: (userAddress: Address) => void;
  getAllChains: () => void;
};

export const CustomChainContext = createContext<CustomChainContextType | undefined>(undefined);

export function CustomChainProvider({ children }: { children: ReactNode }) {
  const [chains, setChains] = useState<CustomChain[]>([]);
  const [loading, setLoading] = useState(false);

  const createChain = (userAddress: Address, chain: CustomChain) => {
    const storedChains = localStorage.getItem(`chains`);
    const parsedChains: CustomChain[] = storedChains ? JSON.parse(storedChains) : [];
    parsedChains.push({ ...chain, user: userAddress });
    localStorage.setItem(`chains`, JSON.stringify(parsedChains));
    setChains(parsedChains);
  };

  const deleteChain = (userAddress: Address, chainId: number) => {
    const storedChains = localStorage.getItem(`chains`);
    if (!storedChains) return;
    const parsedChains: CustomChain[] = JSON.parse(storedChains).filter(
      (chain: CustomChain) => chain.chainId !== chainId && chain.user === userAddress
    );
    localStorage.setItem(`chains`, JSON.stringify(parsedChains));
    setChains(parsedChains);
  };

  const getUserChains = (userAddress: Address) => {
    setLoading(true);
    const storedChains = localStorage.getItem(`chains`);
    const parsedChains: CustomChain[] = storedChains ? JSON.parse(storedChains) : [];
    setChains(parsedChains.filter((chain: CustomChain) => chain.user === userAddress));
    setLoading(false);
  };

  const getAllChains = () => {
    setLoading(true);
    const storedChains = localStorage.getItem(`chains`);
    const parsedChains: CustomChain[] = storedChains ? JSON.parse(storedChains) : [];
    setChains(parsedChains);
    setLoading(false);
  };

  return (
    <CustomChainContext.Provider
      value={{ chains, loading, createChain, deleteChain, getUserChains, getAllChains }}
    >
      {children}
    </CustomChainContext.Provider>
  );
}
