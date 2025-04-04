import { FILTERS } from "@/constants";
import { CustomChainPayload, CustomChain } from "@/types";
import { Address } from "viem";
import { api } from "./api";

export default class CustomChainService {
  static formatChainPayload(data: CustomChainPayload): CustomChain {
    return {
      isTestnet: data.isTestnet,
      user: data.user,
      chainId: data.chainId,
      name: data.name,
      parentChainId: data.parentChainId,
      explorer: {
        default: {
          url: data.explorerUrl,
        },
      },
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
      chainType: data.chainType,
    };
  }

  static createChain = async (payload: CustomChainPayload) => {
    const chain = CustomChainService.formatChainPayload(payload);
    await api.chains.create(chain);
    return chain;
  };

  static addChain = async (chain: CustomChain) => {
    const existingChain = await CustomChainService.getChainById(chain.chainId);

    if (existingChain) return existingChain;

    await api.chains.create(chain);

    return chain;
  };

  static deleteChain = async (userAddress: Address, chainId: number) => {
    await api.chains.delete(chainId);

    return await Promise.all([
      api.chains.getAllUserChains(userAddress),
      api.chains.getAllPublic(),
    ]).then(([userChains, allChains]) => [...userChains, ...allChains]);
  };

  static filterChain(chain: CustomChain, filter: FILTERS) {
    switch (filter) {
      case FILTERS.ALL:
        return true;
      case FILTERS.FEATURED:
        return !!chain.featured;
      case FILTERS.OWN:
        return chain.isCustom;
    }
  }
  static getUserChains = async (
    userAddress: Address,
    search: string = "",
    filter: FILTERS
  ) => {
    const [publicChains, userChains] = await Promise.all([
      api.chains.getAllPublic(),
      api.chains.getAllUserChains(userAddress),
    ]);
    const filteredChains = [...publicChains, ...userChains]
      .filter((chain) =>
        search ? chain.name.toLowerCase().includes(search.toLowerCase()) : true
      )
      .filter((chain) =>
        CustomChainService.filterChain(chain as CustomChain, filter)
      )
      .filter((chain) => chain.chainType !== "L1");

    return filteredChains;
  };

  static getAllChains = async () => {
    const apiChains = await api.chains.getAllPublic();
    return apiChains;
  };

  static getChainById = async (chainId: number) => {
    const chain = await api.chains.getByChainId(chainId);

    return chain;
  };

  static editChain = async (payload: CustomChainPayload) => {
    const chain = CustomChainService.formatChainPayload(payload);

    const dbChain = await CustomChainService.getChainById(payload.chainId);
    if (!dbChain) throw new Error("attempting to edit another user's chain");

    await api.chains.edit(chain);
    return chain;
  };

  static featureChain = async (chainId: number, userAddress: Address) => {
    const chain = await api.chains.getByChainId(chainId);

    if (!chain) throw new Error("Chain doesn't exist for the user");

    chain.featured = !chain.featured;

    await api.chains.setFeatured(chain.chainId, chain.featured, userAddress);

    return chain;
  };
}
