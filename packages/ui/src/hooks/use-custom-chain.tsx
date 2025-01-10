import { useState,  useEffect } from "react";
import { CustomChain } from "@/types";
import { Address, zeroAddress } from "viem";
import { defaultCustomChain, defaultCustomMainnet } from "@/lib/wagmi-config";
import { FILTERS } from "@/constants";

export function useCustomChain() {
  const [chains, setChains] = useState<CustomChain[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initDefaultChains = async () => {
      const chainExists = await getChainById(defaultCustomChain.chainId);
      if (!chainExists) {
        await createChain(zeroAddress, defaultCustomChain);
        await createChain(zeroAddress, defaultCustomMainnet);
      }
    };
    initDefaultChains();
  }, []);


  const createChain = (userAddress: Address, chain: CustomChain) => {
    const storedChains = localStorage.getItem(`chains`);
    const parsedChains: CustomChain[] = storedChains
      ? JSON.parse(storedChains)
      : [];

    const chainExists = parsedChains.find(
      (c) => c.chainId === chain.chainId && c.user === userAddress,
    );
    if (!chainExists) parsedChains.push({ ...chain, user: userAddress });
    localStorage.setItem(`chains`, JSON.stringify(parsedChains));
    setChains(parsedChains);
  };

  const deleteChain = (userAddress: Address, chainId: number) => {
    const storedChains = localStorage.getItem(`chains`);
    if (!storedChains) return;
    const parsedChains: CustomChain[] = JSON.parse(storedChains).filter(
      (chain: CustomChain) =>
        chain.chainId !== chainId && chain.user === userAddress,
    );
    localStorage.setItem(`chains`, JSON.stringify(parsedChains));
    setChains(parsedChains);
  };

  const getUserChains = (
    userAddress: Address,
    search: string = "",
    filter: FILTERS,
  ) => {
    setLoading(true);
    const storedChains = localStorage.getItem(`chains`);
    const parsedChains: CustomChain[] = storedChains
      ? JSON.parse(storedChains)
      : [];

    const filteredChains = parsedChains.filter((chain: CustomChain) => {
      const matchesUser =
        chain.user === userAddress ||
        (chain.user === zeroAddress && !!chain.parentChainId);
      const matchesSearch = search
        ? chain.name.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchesUser && matchesSearch;
    });
    setChains(filteredChains);
    setLoading(false);
  };

  const getAllChains = () => {
    setLoading(true);
    const storedChains = localStorage.getItem(`chains`);
    const parsedChains: CustomChain[] = storedChains
      ? JSON.parse(storedChains)
      : [];
    setChains(parsedChains);
    setLoading(false);
  };

  const getChainById = (chainId: number) => {
    setLoading(true);
    const storedChains = localStorage.getItem(`chains`);
    const parsedChains: CustomChain[] = storedChains
      ? JSON.parse(storedChains)
      : [];
    const chain = parsedChains.find(
      (chain: CustomChain) => chain.chainId === chainId,
    );
    return chain || null;
  };

  return {
    chains,
    loading,
    createChain,
    deleteChain,
    getUserChains,
    getAllChains,
    getChainById,
  };
}
