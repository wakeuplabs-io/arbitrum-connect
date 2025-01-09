import { useMemo } from "react";
import { createConfig, WagmiProvider } from "wagmi";
import { arbitrum, arbitrumSepolia, mainnet, sepolia } from "wagmi/chains";
import { defineChain, http } from "viem";
import envParsed from "@/envParsed";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { CustomChain } from "@/types";
import { useCustomChainContext } from "@/hooks/use-custom-chain";

function WagmiSetup({ children }: { children: React.ReactNode }) {
  const {
    chains: customChains,
  } = useCustomChainContext();

  

  const definedChains = useMemo(() => {
    return customChains.map((chain: CustomChain) => {
      return defineChain({
        ...chain,
        id: chain.chainId,
      });
    });
  }, [customChains]);

  const allChains = envParsed().IS_TESTNET
    ? [arbitrumSepolia, sepolia, ...definedChains] as const
    : [arbitrum, mainnet, ...definedChains] as const;
    
  const transports = useMemo(() => {
    const transportMap: Record<number, ReturnType<typeof http>> = {};
    allChains.forEach((chain) => {
      transportMap[chain.id] = http();
    });
    return transportMap;
  }, [allChains]);
  
  definedChains.forEach((chain) => {
    transports[chain.id] = http();
  });

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
