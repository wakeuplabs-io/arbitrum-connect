import { FILTERS, TESTNET_FILTER } from "@/constants";
import { CustomChainPayload, CustomChain, NetworkFilter } from "@/types";
import { Address } from "viem";
import { api } from "./api";
import { AuthenticatedApiClient } from "@/hooks/use-api-client";

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

  static createChain = async (
    client: AuthenticatedApiClient,
    payload: CustomChainPayload
  ) => {
    const chain = CustomChainService.formatChainPayload(payload);
    await api.chains.create(client, chain);
    return chain;
  };

  static addChain = async (
    client: AuthenticatedApiClient,
    chain: CustomChain
  ) => {
    await api.chains.create(client, chain);

    return chain;
  };

  static deleteChain = async (
    client: AuthenticatedApiClient,
    chainId: number
  ) => {
    await api.chains.delete(client, chainId);

    return await Promise.all([
      api.chains.getAllUserChains(),
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

  static getUserChains = async () => {
    const userAddress = localStorage.getItem("last-wallet-address") as Address;

    const promises = [api.chains.getAllPublicChains()];
    if (userAddress) promises.push(api.chains.getAllUserChains());

    const [publicChains, userChains = []] = await Promise.all(promises);

    return [...publicChains, ...userChains];
  };

  static getFilteredUserChains = async (
    search: string = "",
    filter: FILTERS,
    testnetFilter?: NetworkFilter
  ) => {
    const promises = [
      api.chains.getAllPublicChains(),
      api.chains.getAllUserChains(),
    ];

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

  static editChain = async (
    client: AuthenticatedApiClient,
    payload: CustomChainPayload
  ) => {
    const chain = CustomChainService.formatChainPayload(payload);

    // add signature for validation and send edited chain

    await api.chains.edit(client, chain);
    return chain;
  };

  static featureChain = async (
    client: AuthenticatedApiClient,
    chainId: number
  ) => {
    const address = localStorage.getItem("last-wallet-address") as Address;

    const chain = await api.chains.getByChainId(chainId, address);

    if (!chain) throw new Error("Chain doesn't exist for the user");

    chain.featured = !chain.featured;

    await api.chains.setFeatured(client, chain.chainId, chain.featured);

    return chain;
  };
}
