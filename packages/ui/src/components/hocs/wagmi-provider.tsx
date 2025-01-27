import { useMemo } from "react";
import { createConfig, WagmiProvider } from "wagmi";
import { defineChain, http, Chain } from "viem";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";
import { CustomChain } from "@/types";
import { braveWallet } from "@rainbow-me/rainbowkit/wallets";
import { defaultCustomChain, defaultCustomMainnet } from "@/lib/wagmi-config";
import { useChains } from "@/hooks/use-chains";

function WagmiSetup({ children }: { children: React.ReactNode }) {
  const { chains } = useChains();

  const definedChains: [Chain, ...Chain[]] = useMemo(() => {
    let myChains: [Chain, ...Chain[]] = [
      defineChain({
        ...defaultCustomMainnet,
        id: defaultCustomMainnet.chainId,
      }),
      defineChain({
        ...defaultCustomChain,
        id: defaultCustomChain.chainId,
      }),
    ];
    chains.forEach((chain: CustomChain) => {
      if (
        chain.chainId !== defaultCustomChain.chainId &&
        chain.chainId !== defaultCustomMainnet.chainId
      )
        myChains.push(
          defineChain({
            ...chain,
            id: chain.chainId,
          }),
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
    },
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
