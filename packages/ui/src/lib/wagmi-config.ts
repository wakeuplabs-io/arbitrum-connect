import envParsed from "@/envParsed";
import { ChainType, CustomChain } from "@/types";
import { getArbitrumNetwork } from "@arbitrum/sdk";
import { arbitrum, arbitrumSepolia, mainnet, sepolia } from "wagmi/chains";
import ArbitrumIcon from "@/assets/arbitrum-icon.svg";
import EthereumIcon from "@/assets/ethereum-icon.svg";


export const l2Chain = envParsed().IS_TESTNET ? arbitrumSepolia : arbitrum;

export const customMainnet: CustomChain = {
  ...mainnet,
  logoURI: EthereumIcon,
  isTestnet: false,
  isCustom: false,
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
    }
  },
  chainType: "L1"
};
export const customSepolia: CustomChain = {
  ...sepolia,
  logoURI: EthereumIcon,
  isTestnet: envParsed().IS_TESTNET,
  isCustom: false,
  chainId: sepolia.id,
  parentChainId: 0,
  ethBridge: "0x" as any,
  confirmPeriodBlocks: 0,
  explorer: {
    default: {
      url: sepolia.blockExplorers.default.url,
    }
  },
  rpcUrls: {
    default: {
      http: ["https://ethereum-sepolia-rpc.publicnode.com"],
    },
  },
  chainType: "L1"
};

export const defaultCustomMainnet = envParsed().IS_TESTNET ? customSepolia : customMainnet;

const arbitrumNetwork = getArbitrumNetwork(arbitrum.id);
export const customArbitrum: CustomChain = {
  ...arbitrum,
  logoURI: ArbitrumIcon,
  isTestnet: envParsed().IS_TESTNET,
  isCustom: false,
  chainId: arbitrumNetwork.chainId,
  parentChainId: arbitrumNetwork.parentChainId,
  ethBridge: arbitrumNetwork.ethBridge,
  confirmPeriodBlocks: arbitrumNetwork.confirmPeriodBlocks,
  explorer: {
    default: {
      url: arbitrum.blockExplorers.default.url,
    }
  },
  rpcUrls: {
    default: {
      http: [arbitrum.rpcUrls.default.http[0]],
    },
  },
  chainType: ChainType.L2
};
const arbitrumSepoliaNetwork = getArbitrumNetwork(arbitrumSepolia.id);
export const customArbitrumSepolia: CustomChain = {
  ...arbitrumSepolia,
  logoURI: ArbitrumIcon,
  isTestnet: envParsed().IS_TESTNET,
  isCustom: false,
  chainId: arbitrumSepoliaNetwork.chainId,
  parentChainId: arbitrumSepoliaNetwork.parentChainId,
  ethBridge: arbitrumSepoliaNetwork.ethBridge,
  confirmPeriodBlocks: arbitrumSepoliaNetwork.confirmPeriodBlocks,
  explorer: {
    default: {
      url: arbitrumSepolia.blockExplorers.default.url,
    }
  },
  rpcUrls: {
    default: {
      http: [arbitrumSepolia.rpcUrls.default.http[0]],
    },
  },
  chainType: ChainType.L2
};

export const defaultCustomChild = envParsed().IS_TESTNET ? customArbitrumSepolia : customArbitrum;