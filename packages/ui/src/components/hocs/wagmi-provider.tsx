import { useMemo } from "react";
import { createConfig, WagmiProvider } from "wagmi";
import { defineChain, http, Chain } from "viem";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { CustomChain } from "@/types";
import { braveWallet } from "@rainbow-me/rainbowkit/wallets";
import {
  customArbitrum,
  customArbitrumSepolia,
  customMainnet,
  customSepolia,
} from "@/lib/wagmi-config";
import { useChains } from "@/hooks/use-chains";

function WagmiSetup({ children }: { children: React.ReactNode }) {
  const { chains } = useChains();

  const definedChains: [Chain, ...Chain[]] = useMemo(() => {
    let myChains: [Chain, ...Chain[]] = [
      defineChain({
        ...customMainnet,
        id: customMainnet.chainId,
      }),
      defineChain({
        ...customSepolia,
        id: customSepolia.chainId,
      }),
      defineChain({
        ...customArbitrum,
        id: customArbitrum.chainId,
      }),
      defineChain({
        ...customArbitrumSepolia,
        id: customArbitrumSepolia.chainId,
      }),
    ];
    chains.forEach((chain: CustomChain) => {
      if (
        ![
          customMainnet.chainId,
          customSepolia.chainId,
          customArbitrum.chainId,
          customArbitrumSepolia.chainId,
        ].includes(chain.chainId)
      )
        myChains.push(
          defineChain({
            ...chain,
            id: chain.chainId,
          })
        );
    });

    return myChains;
  }, [chains]);

  const transports = useMemo(() => {
    const transportMap: Record<number, ReturnType<typeof http>> = {};
    definedChains.forEach((chain) => {
      transportMap[chain.id] = http();
    });
    return transportMap;
  }, [definedChains]);

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
    }
  );

  const config = createConfig({
    chains: definedChains,
    transports,
    connectors,
    ssr: false,
  });

  return <WagmiProvider config={config}>{children}</WagmiProvider>;
}

export default WagmiSetup;
