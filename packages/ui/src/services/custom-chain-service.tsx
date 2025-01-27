import { FILTERS } from "@/constants";
import { CustomChainPayload, CustomChain } from "@/types";
import { Address } from "viem";

export default class CustomChainService {
  static formatChainPayload(data: CustomChainPayload): CustomChain {
    return {
      isTestnet: data.isTestnet,
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

  static createChain = (payload: CustomChainPayload) => {
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

  static filterChain(chain: CustomChain, filter: FILTERS, user: Address) {
    switch (filter) {
      case FILTERS.ALL:
        return true;
      case FILTERS.FEATURED:
        return !!chain.featured;
      case FILTERS.OWN:
        return chain.user === user;
    }
  }
  static getUserChains = (
    userAddress: Address,
    search: string = "",
    filter: FILTERS, //TODO: implement
  ) => {
    const storedChains = localStorage.getItem(`chains`);
    const parsedChains: CustomChain[] = storedChains
      ? JSON.parse(storedChains)
      : [];

    const filteredChains = parsedChains.filter((chain: CustomChain) => {
      const matchesUser = chain.user === userAddress;
      const matchesSearch = search
        ? chain.name.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchFilter = CustomChainService.filterChain(
        chain,
        filter,
        userAddress,
      );
      return matchesUser && matchesSearch && matchFilter;
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

  static getChainById = (chainId: number, userAddress?: Address) => {
    const storedChains = localStorage.getItem(`chains`);
    const parsedChains: CustomChain[] = storedChains
      ? JSON.parse(storedChains).filter((chain: CustomChain) =>
          userAddress ? chain.user === userAddress : true,
        )
      : [];
    const chain = parsedChains.find(
      (chain: CustomChain) => chain.chainId === chainId,
    );
    return chain || null;
  };

  static editChain = async (payload: CustomChainPayload) => {
    const storedChains = localStorage.getItem(`chains`);
    const parsedChains: CustomChain[] = storedChains
      ? JSON.parse(storedChains)
      : [];
    const chain = CustomChainService.formatChainPayload(payload);
    const newChains = parsedChains.map((c) => {
      if (c.chainId === payload.chainId && c.user === payload.user) {
        return chain;
      }
      return c;
    });
    localStorage.setItem(`chains`, JSON.stringify(newChains));
    return chain;
  };

  static featureChain = (userAddress: Address, chainId: number) => {
    const storedChains = localStorage.getItem(`chains`);
    const parsedChains: CustomChain[] = storedChains
      ? JSON.parse(storedChains)
      : [];

    let chain = parsedChains.find(
      (c) => c.chainId === chainId && c.user === userAddress,
    );

    if (!chain) {
      chain = parsedChains.find(
        (chain: CustomChain) => chain.chainId === chainId,
      );
      if (!chain) throw new Error("Chain doesn't exist");

      chain = CustomChainService.addChain({ ...chain, user: userAddress });
    }

    chain.featured = !chain.featured;

    const newChains = parsedChains.map((c) => {
      if (c.chainId === chainId && c.user === userAddress) {
        return chain;
      }
      return c;
    });
    localStorage.setItem(`chains`, JSON.stringify(newChains));

    return chain;
  };
}
