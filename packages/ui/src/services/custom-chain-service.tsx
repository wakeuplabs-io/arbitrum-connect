import { FILTERS, TESTNET_FILTER } from "@/constants";
import { CustomChainPayload, CustomChain, NetworkFilter } from "@/types";
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
      isOrbit: true,
      confirmPeriodBlocks: 0,
      tokenBridge: data.tokenBridge,
    };
  }

  static createChain = async (payload: CustomChainPayload) => {
    const chain = CustomChainService.formatChainPayload(payload);
    await api.chains.create(chain);
    return chain;
  };

  static addChain = async (chain: CustomChain, userAddress: Address) => {
    const existingChain = await CustomChainService.getChainById(
      chain.chainId,
      userAddress
    );

    if (existingChain) return existingChain;

    await api.chains.create(chain);

    return chain;
  };

  static deleteChain = async (userAddress: Address, chainId: number) => {
    await api.chains.delete(userAddress, chainId);

    return await Promise.all([
      api.chains.getAllUserChains(userAddress),
      api.chains.getAllPublicChains(),
    ]).then(([userChains, allChains]) => [...userChains, ...allChains]);
  };

  static filterChain(
    chain: CustomChain,
    filter: FILTERS,
    search?: string,
    testnetFilter?: NetworkFilter
  ) {
    const matchesSearch = search
      ? chain.name.toLowerCase().includes(search.toLowerCase())
      : true;

    const matchesFilter = (() => {
      switch (filter) {
        case FILTERS.ALL:
          return true;
        case FILTERS.FEATURED:
          return !!chain.featured;
        case FILTERS.OWN:
          return chain.isCustom;
        default:
          return true;
      }
    })();

    const isOrbitChain = chain.isOrbit;

    const matchesNetwork =
      testnetFilter === TESTNET_FILTER.TESTNET
        ? chain.isTestnet
        : testnetFilter === TESTNET_FILTER.MAINNET
          ? !chain.isTestnet
          : true;

    return matchesSearch && matchesFilter && isOrbitChain && matchesNetwork;
  }

  static getUserChains = async (userAddress?: Address) => {
    const promises = [api.chains.getAllPublicChains()];
    if (userAddress) promises.push(api.chains.getAllUserChains(userAddress));

    const [publicChains, userChains = []] = await Promise.all(promises);

    return [...publicChains, ...userChains];
  };

  static getFilteredUserChains = async (
    userAddress: Address,
    search: string = "",
    filter: FILTERS,
    testnetFilter?: NetworkFilter
  ) => {
    const promises = [api.chains.getAllPublicChains()];
    if (userAddress !== "0x")
      promises.push(api.chains.getAllUserChains(userAddress));

    const [publicChains, userChains] = await Promise.all(promises);

    return [...publicChains, ...userChains].filter((chain) =>
      CustomChainService.filterChain(
        chain as CustomChain,
        filter,
        search,
        testnetFilter
      )
    );
  };

  static getAllChains = async () => {
    const apiChains = await api.chains.getAllPublicChains();
    return apiChains;
  };

  static getChainById = async (chainId: number, userAddress: Address) => {
    const chain = await api.chains.getByChainId(chainId, userAddress);

    return chain;
  };

  static editChain = async (payload: CustomChainPayload) => {
    const chain = CustomChainService.formatChainPayload(payload);

    // add signature for validation and send edited chain

    await api.chains.edit(chain);
    return chain;
  };

  static featureChain = async (chainId: number, userAddress: Address) => {
    const chain = await api.chains.getByChainId(chainId, userAddress);

    if (!chain) throw new Error("Chain doesn't exist for the user");

    chain.featured = !chain.featured;

    await api.chains.setFeatured(chain.chainId, chain.featured, userAddress);

    return chain;
  };
}
