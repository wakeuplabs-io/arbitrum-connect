import envParsed from "@/envParsed";
import { CustomChain } from "@/types";
import { getArbitrumNetwork } from "@arbitrum/sdk";
import { arbitrum, arbitrumSepolia, mainnet, sepolia } from "wagmi/chains";

export const l2Chain = envParsed().IS_TESTNET ? arbitrumSepolia : arbitrum;

export const customMainnet: CustomChain = {
  ...mainnet,
  logoURI: new URL("@/assets/ethereum-icon.svg", import.meta.url).href,
  isTestnet: false,
  isCustom: false,
  isOrbit: false,
  chainId: mainnet.id,
  parentChainId: 0,
  ethBridge: "0x" as any,
  confirmPeriodBlocks: 0,
  rpcUrls: {
    default: {
      http: [mainnet.rpcUrls.default.http[0]],
    },
  },
  explorer: {
    default: {
      url: mainnet.blockExplorers.default.url,
    },
  },
};
export const customSepolia: CustomChain = {
  ...sepolia,
  logoURI: new URL("@/assets/ethereum-icon.svg", import.meta.url).href,
  isTestnet: true,
  isCustom: false,
  isOrbit: true,
  chainId: sepolia.id,
  parentChainId: 0,
  ethBridge: "0x" as any,
  confirmPeriodBlocks: 0,
  explorer: {
    default: {
      url: sepolia.blockExplorers.default.url,
    },
  },
  rpcUrls: {
    default: {
      http: ["https://ethereum-sepolia-rpc.publicnode.com"],
    },
  }
};

export const defaultCustomMainnet = envParsed().IS_TESTNET
  ? customSepolia
  : customMainnet;

const arbitrumNetwork = getArbitrumNetwork(arbitrum.id);
export const customArbitrum: CustomChain = {
  ...arbitrum,
  logoURI: new URL("@/assets/arbitrum-icon.svg", import.meta.url).href,
  isTestnet: false,
  isCustom: false,
  isOrbit: true,
  chainId: arbitrumNetwork.chainId,
  parentChainId: arbitrumNetwork.parentChainId,
  ethBridge: arbitrumNetwork.ethBridge,
  confirmPeriodBlocks: arbitrumNetwork.confirmPeriodBlocks,
  explorer: {
    default: {
      url: arbitrum.blockExplorers.default.url,
    },
  },
  rpcUrls: {
    default: {
      http: [arbitrum.rpcUrls.default.http[0]],
    },
  }
};
const arbitrumSepoliaNetwork = getArbitrumNetwork(arbitrumSepolia.id);
export const customArbitrumSepolia: CustomChain = {
  ...arbitrumSepolia,
  logoURI: new URL("@/assets/arbitrum-icon.svg", import.meta.url).href,
  isTestnet: true,
  isCustom: false,
  isOrbit: true,
  chainId: arbitrumSepoliaNetwork.chainId,
  parentChainId: arbitrumSepoliaNetwork.parentChainId,
  ethBridge: arbitrumSepoliaNetwork.ethBridge,
  confirmPeriodBlocks: arbitrumSepoliaNetwork.confirmPeriodBlocks,
  explorer: {
    default: {
      url: arbitrumSepolia.blockExplorers.default.url,
    },
  },
  rpcUrls: {
    default: {
      http: [arbitrumSepolia.rpcUrls.default.http[0]],
    },
  }
};

export const defaultCustomChild = envParsed().IS_TESTNET
  ? customArbitrumSepolia
  : customArbitrum;
