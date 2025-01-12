import { FILTERS } from "@/constants";
import { CreateChainPayload, CustomChain } from "@/types";
import { Address, zeroAddress } from "viem";

export default class CustomChainService {
  static formatChainPayload(data: CreateChainPayload): CustomChain {
    return {
      user: data.user,
      chainId: data.chainId,
      name: data.name,
      parentChainId: data.parentChainId,
      ethBridge: {
        bridge: data.bridge,
        inbox: data.inbox,
        sequencerInbox: data.sequencerInbox,
        outbox: data.outbox,
        rollup: data.rollup,
      },
      nativeCurrency: {
        name: data.nativeCurrencyName,
        symbol: data.nativeCurrencySymbol,
        decimals: data.nativeCurrencyDecimals,
      },
      rpcUrls: {
        default: {
          http: [data.publicRpcUrl],
        },
      },
      logoURI: data.logoURI,
      isCustom: true,
      confirmPeriodBlocks: 0,
    };
  }

  static createChain = (payload: CreateChainPayload) => {
    const storedChains = localStorage.getItem(`chains`);
    const parsedChains: CustomChain[] = storedChains
      ? JSON.parse(storedChains)
      : [];

    const chainExists = parsedChains.find(
      (c) => c.chainId === payload.chainId && c.user === payload.user,
    );
    if (chainExists) throw new Error("Chain already exists");

    const chain = CustomChainService.formatChainPayload(payload);

    parsedChains.push(chain);
    localStorage.setItem(`chains`, JSON.stringify(parsedChains));
    return chain;
  };

  static addChain = (chain: CustomChain) => {
    const storedChains = localStorage.getItem(`chains`);
    const parsedChains: CustomChain[] = storedChains
      ? JSON.parse(storedChains)
      : [];

    const chainExists = parsedChains.find(
      (c) => c.chainId === chain.chainId && c.user === chain.user,
    );
    if (chainExists) throw new Error("Chain already exists");

    parsedChains.push(chain);
    localStorage.setItem(`chains`, JSON.stringify(parsedChains));
    return chain;
  };

  static deleteChain = (userAddress: Address, chainId: number) => {
    const storedChains = localStorage.getItem(`chains`);
    if (!storedChains) return [];
    const parsedChains: CustomChain[] = JSON.parse(storedChains).filter(
      (chain: CustomChain) =>
        chain.chainId !== chainId && chain.user === userAddress,
    );
    localStorage.setItem(`chains`, JSON.stringify(parsedChains));
    return parsedChains;
  };

  static getUserChains = (
    userAddress: Address,
    search: string = "",
    filter: FILTERS,
  ) => {
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
    return filteredChains;
  };

  static getAllChains = () => {
    const storedChains = localStorage.getItem(`chains`);
    const parsedChains: CustomChain[] = storedChains
      ? JSON.parse(storedChains)
      : [];
    return parsedChains;
  };

  static getChainById = (chainId: number) => {
    const storedChains = localStorage.getItem(`chains`);
    const parsedChains: CustomChain[] = storedChains
      ? JSON.parse(storedChains)
      : [];
    const chain = parsedChains.find(
      (chain: CustomChain) => chain.chainId === chainId,
    );
    return chain || null;
  };
}
