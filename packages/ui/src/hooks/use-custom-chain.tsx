import { useState } from "react";
import { CustomChain, CustomChainPayload, NetworkFilter } from "@/types";
import { FILTERS } from "@/constants";
import CustomChainService from "@/services/custom-chain-service";
import { useChains } from "./use-chains";
import { useSelectedChain } from "./use-selected-chain";
import { AuthenticatedApiClient } from "./use-api-client";
import { Address } from "viem";

export function useCustomChain() {
  const { setChains, isLoading: isChainsLoading } = useChains();
  const { customChains, setCustomChains } = useSelectedChain();
  const [loading, setLoading] = useState(isChainsLoading);
  const [publicChains, setPublicChains] = useState<CustomChain[]>([]);

  const createChain = async (
    client: AuthenticatedApiClient,
    chain: CustomChainPayload
  ) => {
    setLoading(true);
    const newChain = await CustomChainService.createChain(client, chain);
    setChains((currentChains) => {
      return [...currentChains, newChain];
    });
    setCustomChains((currentChains) => {
      return [...currentChains, newChain];
    });
    setLoading(false);
    return newChain;
  };

  const deleteChain = async (
    client: AuthenticatedApiClient,
    chainId: number
  ) => {
    const newChains = await CustomChainService.deleteChain(client, chainId);
    setLoading(true);
    setChains(newChains as CustomChain[]);
    setCustomChains(newChains as CustomChain[]);
  };

  const getUserChains = async () => {
    setLoading(true);
    const filteredChains = await CustomChainService.getUserChains();
    setCustomChains(filteredChains as CustomChain[]);
    setLoading(false);
  };
  const getFilteredUserChains = async (
    search: string = "",
    filter: FILTERS,
    testnetFilter?: NetworkFilter
  ) => {
    setLoading(true);
    const filteredChains = await CustomChainService.getFilteredUserChains(
      search,
      filter,
      testnetFilter
    );
    setCustomChains(filteredChains as CustomChain[]);
    setLoading(false);
  };

  const getFilteredPublicChains = async (
    search: string = "",
    filter: FILTERS,
    testnetFilter?: NetworkFilter
  ) => {
    setLoading(true);

    const allChains = await CustomChainService.getAllChains();

    const filteredChains = allChains.filter((chain) =>
      CustomChainService.filterChain(
        chain as CustomChain,
        filter,
        search,
        testnetFilter
      )
    );
    setPublicChains(filteredChains as CustomChain[]);
    setLoading(false);
  };

  const editChain = async (
    client: AuthenticatedApiClient,
    chain: CustomChainPayload
  ) => {
    setLoading(true);
    const editedChain = await CustomChainService.editChain(client, chain);
    setChains((currentChains) => {
      return currentChains.map((c) => {
        if (c.chainId === editedChain.chainId) {
          return editedChain;
        }
        return c;
      });
    });
    setCustomChains((currentChains) => {
      return currentChains.map((c) => {
        if (c.chainId === editedChain.chainId && c.user === chain.user) {
          return editedChain;
        }
        return c;
      });
    });
    setLoading(false);
    return editedChain;
  };

  const featureChain = async (
    client: AuthenticatedApiClient,
    chainId: number
  ) => {
    setLoading(true);
    const chain = await CustomChainService.featureChain(client, chainId);
    const lastAddress = localStorage.getItem("last-wallet-address") as Address;

    setCustomChains((currentChains) => {
      return currentChains.map((c) => {
        if (c.chainId === chain.chainId && c.user === lastAddress) {
          return chain as CustomChain;
        }
        return c;
      });
    });
    setLoading(false);
  };

  return {
    customChains,
    publicChains,
    loading,
    createChain,
    deleteChain,
    getUserChains,
    getFilteredUserChains,
    getFilteredPublicChains,
    editChain,
    setCustomChains,
    featureChain,
  };
}
