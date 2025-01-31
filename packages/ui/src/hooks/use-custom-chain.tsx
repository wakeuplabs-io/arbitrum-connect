import { useEffect, useState } from "react";
import { CustomChainPayload, CustomChain } from "@/types";
import { Address } from "viem";
import { FILTERS } from "@/constants";
import CustomChainService from "@/services/custom-chain-service";
import { useChains } from "./use-chains";
import { useAccount } from "wagmi";
import { defaultCustomChain } from "@/lib/wagmi-config";

export function useCustomChain() {
  const { chains, setChains } = useChains();
  const { address } = useAccount();
  const [customChains, setCustomChains] = useState(chains);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!address) return;
    fixUserChains();
  }, [address]);

  const createChain = (chain: CustomChainPayload) => {
    setLoading(true);
    const newChain = CustomChainService.createChain(chain);
    setChains((currentChains) => {
      return [...currentChains, newChain];
    });
    setLoading(false);
    return newChain;
  };

  const deleteChain = (userAddress: Address, chainId: number) => {
    setLoading(true);
    const newChains = CustomChainService.deleteChain(userAddress, chainId);
    setChains(newChains);
  };

  const getUserChains = (
    userAddress: Address,
    search: string = "",
    filter: FILTERS,
  ) => {
    setLoading(true);
    const filteredChains = CustomChainService.getUserChains(
      userAddress,
      search,
      filter,
    );
    setCustomChains(filteredChains);
    setLoading(false);
  };

  //Creates new default chains for the current user
  const fixUserChains = () => {
    if (!address) return;
    const allChains = CustomChainService.getUserChains(
      address,
      "",
      FILTERS.ALL,
    );

    if (
      !allChains.some(
        (x) => x.chainId === defaultCustomChain.chainId && x.user === address,
      )
    ) {
      const fixedChain = CustomChainService.addChain({
        ...defaultCustomChain,
        user: address,
      });
      setCustomChains([...allChains, fixedChain]);
    } else {
      setCustomChains(allChains);
    }
  };

  const getChainById = (chainId: number, userAddress?: Address) => {
    setLoading(true);
    const storedChains = localStorage.getItem(`chains`);
    const parsedChains: CustomChain[] = storedChains
      ? JSON.parse(storedChains)
      : [];
    let chain: CustomChain | undefined;
    if (userAddress) {
      chain = parsedChains.find(
        (chain: CustomChain) =>
          chain.chainId === chainId && userAddress === chain.user,
      );
      if (!chain) {
        chain = parsedChains.find(
          (chain: CustomChain) => chain.chainId === chainId,
        );
        if (!chain) throw new Error("Chain doesn't exist");

        CustomChainService.addChain({ ...chain, user: userAddress });
      }
    } else {
      chain = parsedChains.find(
        (chain: CustomChain) => chain.chainId === chainId,
      );
    }

    return chain || null;
  };

  const editChain = async (chain: CustomChainPayload) => {
    setLoading(true);
    const editedChain = await CustomChainService.editChain(chain);
    setChains((currentChains) => {
      return currentChains.map((c) => {
        if (c.chainId === editedChain.chainId) {
          return editedChain;
        }
        return c;
      });
    });
    setLoading(false);
    return editedChain;
  };

  const featureChain = async (userAddress: Address, chainId: number) => {
    setLoading(true);
    let chain = CustomChainService.featureChain(userAddress, chainId);

    setCustomChains((currentChains) => {
      return currentChains.map((c) => {
        if (c.chainId === chain.chainId && c.user === userAddress) {
          return chain;
        }
        return c;
      });
    });
    setLoading(false);
  };

  return {
    customChains,
    loading,
    createChain,
    deleteChain,
    getUserChains,
    getChainById,
    editChain,
    setCustomChains,
    featureChain,
  };
}
