import { useEffect, useMemo } from "react";
import { createConfig, WagmiProvider } from "wagmi";
import { arbitrum, arbitrumSepolia, mainnet, sepolia } from "wagmi/chains";
import { defineChain, http } from "viem";
import envParsed from "@/envParsed";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { CustomChain } from "@/types";
import { useCustomChain } from "@/hooks/use-custom-chain";
import { braveWallet } from '@rainbow-me/rainbowkit/wallets';

export const sepoliaOverride = defineChain({
  id: 11_155_111,
  name: 'Sepolia',
  nativeCurrency: { name: 'Sepolia Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://endpoints.omniatech.io/v1/eth/sepolia/public'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Etherscan',
      url: 'https://sepolia.etherscan.io',
      apiUrl: 'https://api-sepolia.etherscan.io/api',
    },
  },
  contracts: {
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 751532,
    },
    ensRegistry: { address: '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' },
    ensUniversalResolver: {
      address: '0xc8Af999e38273D658BE1b921b88A9Ddf005769cC',
      blockCreated: 5_317_080,
    },
  },
  testnet: true,
});

function WagmiSetup({ children }: { children: React.ReactNode }) {
  const { chains, getAllChains } = useCustomChain();

  useEffect(() => {
    getAllChains();
  }, []);

  const definedChains = useMemo(() => {
    return chains.map((chain: CustomChain) => {
      return defineChain({
        ...chain,
        id: chain.chainId,
      });
    });
  }, [chains]);

  const allChains = envParsed().IS_TESTNET
    ? ([arbitrumSepolia, sepoliaOverride, ...definedChains] as const)
    : ([arbitrum, mainnet, ...definedChains] as const);

  const transports = useMemo(() => {
    const transportMap: Record<number, ReturnType<typeof http>> = {};
    allChains.forEach((chain) => {
      transportMap[chain.id] = http();
    });
    return transportMap;
  }, [allChains]);

  const connectors = connectorsForWallets(
    [
      {
        groupName: "My Wallets",
        wallets: [metaMaskWallet, braveWallet],
      },
    ],
    {
      appName: "Arbitrum PoC",
      projectId: "ARBITRUM_POC",
    },
  );

  const config = createConfig({
    chains: allChains,
    transports,
    connectors,
    ssr: false,
  });

  return <WagmiProvider config={config}>{children}</WagmiProvider>;
}

export default WagmiSetup;
