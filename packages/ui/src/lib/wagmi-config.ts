import envParsed from "@/envParsed";
import { CustomChain } from "@/types";
import { getArbitrumNetwork } from "@arbitrum/sdk";
import { arbitrum, arbitrumSepolia, mainnet, sepolia } from "wagmi/chains";

export const l2Chain = envParsed().IS_TESTNET ? arbitrumSepolia : arbitrum;
export const l1Chain = envParsed().IS_TESTNET ? sepolia : mainnet;

export const defaultCustomMainnet : CustomChain = {
  ...l1Chain,
  isCustom: false,
  chainId: l1Chain.id,
  parentChainId: 0,
  ethBridge: "0x" as any,
  confirmPeriodBlocks: 0,
  rpcUrls: {
    default: {
      http: [l1Chain.rpcUrls.default.http[0]],
    },
  },
};
const defaultArbNetwork = getArbitrumNetwork(l2Chain.id);
export const defaultCustomChain : CustomChain = {
  ...l2Chain,
  isCustom: false,
  chainId: defaultArbNetwork.chainId,
  parentChainId: defaultArbNetwork.parentChainId,
  ethBridge: defaultArbNetwork.ethBridge,
  confirmPeriodBlocks: defaultArbNetwork.confirmPeriodBlocks,
  rpcUrls: {
    default: {
      http: [l2Chain.rpcUrls.default.http[0]],
    },
  },
};
