import envParsed from "@/envParsed";
import { CustomChain } from "@/types";
import { getArbitrumNetwork } from "@arbitrum/sdk";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { defineChain } from "viem";
import { createConfig, http } from "wagmi";
import { arbitrum, arbitrumSepolia, mainnet, sepolia } from "wagmi/chains";

export const l2Chain = envParsed().IS_TESTNET ? arbitrumSepolia : arbitrum;
export const l1Chain = envParsed().IS_TESTNET ? sepolia : mainnet;

export const defaultCustomMainnet : CustomChain = {
  ...mainnet,
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

export const l3Chain = defineChain({
  id: 24802239149,
  name: 'L3 Juanchi Sep',
  nativeCurrency: {
    name: 'Arbitrum Juanchi Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://6318-181-209-117-220.ngrok-free.app'],
    },
  },
});

const testChains = [arbitrumSepolia, sepolia, l3Chain] as const;
const testTransports = {
  [arbitrumSepolia.id]: http(),
  [sepolia.id]: http(),
  [l3Chain.id]: http(),
};
const chains = [arbitrum, mainnet, l3Chain] as const;
const transports = {
  [arbitrum.id]: http(),
  [mainnet.id]: http(),
  [l3Chain.id]: http(),
};

const connectors = connectorsForWallets(
  [
    {
      groupName: "My Wallets",
      wallets: [metaMaskWallet],
    },
  ],
  {
    appName: "Arbitrum PoC",
    projectId: "ARBITRUM_POC",
  }
);

const config = envParsed().IS_TESTNET
  ? createConfig({
      chains: testChains,
      transports: testTransports,
      connectors,
      ssr: false,
    })
  : createConfig({
      chains,
      transports,
      connectors,
      ssr: false,
    });

const supportedchains = chains.map((x) => Number(x.id));

export function isChainSupported(chainId: number) {
  return supportedchains.includes(chainId);
}

export const currentChains = envParsed().IS_TESTNET ? testChains : chains;
export default config;
