import { FILTERS } from "@/constants";
import { db } from "@/db/db";
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
    const chainExists = await db.chains
      .where(["user", "chainId"])
      .equals([payload.user, payload.chainId])
      .first();

    if (chainExists) throw new Error("Chain already exists");

    const chain = CustomChainService.formatChainPayload(payload);

    db.chains.add(chain);

    return chain;
  };

  static addChain = async (chain: CustomChain, userAddress: Address) => {
    const existingChain = await CustomChainService.getChainById(
      chain.chainId,
      userAddress
    );

    if (existingChain) return existingChain;

    await db.chains.add({ ...chain, id: undefined });

    return chain;
  };

  static deleteChain = async (userAddress: Address, chainId: number) => {
    await db.chains.where({ user: userAddress, chainId }).delete();

    return await db.chains.where("user").equals(userAddress).toArray();
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
    const filteredChains = await db.chains
      .where({ user: userAddress })
      .and((c) =>
        search ? c.name.toLowerCase().includes(search.toLowerCase()) : true
      )
      .and((c) => CustomChainService.filterChain(c, filter))
      .and((c) => c.chainType !== "L1")
      .toArray();
    return filteredChains;
  };

  static getAllChains = async () => {
    const dbChains = await db.chains.toArray();

    return dbChains;
  };

  static getChainById = async (chainId: number, userAddress?: Address) => {
    let chain: CustomChain | undefined;

    if (userAddress)
      chain = await db.chains
        .where(["user", "chainId"])
        .equals([userAddress, chainId])
        .first();
    else chain = await db.chains.where("chainId").equals(chainId).first();

    return chain || null;
  };

  static editChain = async (payload: CustomChainPayload) => {
    const chain = CustomChainService.formatChainPayload(payload);

    const dbChain = await CustomChainService.getChainById(
      payload.chainId,
      payload.user
    );
    if (!dbChain) throw new Error("attempting to edit another user's chain");

    await db.chains.update(
      {
        id: dbChain.id,
        user: chain.user,
        chainId: chain.chainId,
      } as CustomChain,
      { ...chain }
    );

    return chain;
  };

  static featureChain = async (userAddress: Address, chainId: number) => {
    let chain = await db.chains.where({ user: userAddress, chainId }).first();

    if (!chain) throw new Error("Chain doesn't exist for the user");

    chain.featured = !chain.featured;

    await db.chains.update(
      { id: chain.id, user: userAddress, chainId: chainId } as CustomChain,
      {
        featured: chain.featured,
      }
    );

    return chain;
  };
}
