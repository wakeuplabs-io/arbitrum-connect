import { useMemo } from "react";
import { createConfig, WagmiProvider } from "wagmi";
import { arbitrum, arbitrumSepolia, mainnet, sepolia } from "wagmi/chains";
import useCustomChain from "@/hooks/use-custom-chain";
import { defineChain, http } from "viem";
import envParsed from "@/envParsed";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { metaMaskWallet } from "@rainbow-me/rainbowkit/wallets";

function WagmiSetup(props: any) {
  const { chains: customChains, loading } = useCustomChain();

  const definedChains = useMemo(() => {
    return customChains.map((chain) => {
      return defineChain({
        ...chain,
        id: chain.chainId,
      });
    });
  }, [customChains]);

  const testChains = [arbitrumSepolia, sepolia, ...definedChains] as const;
  const transports: any = {
    [arbitrumSepolia.id]: http(),
    [sepolia.id]: http(),
    [arbitrum.id]: http(),
    [mainnet.id]: http(),
  };

  definedChains.forEach((chain) => {
    transports[chain.id] = http();
  });

  const chains = [arbitrum, mainnet, ...definedChains] as const;

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

  const config = envParsed().IS_TESTNET
    ? createConfig({
        chains: testChains,
        transports: transports,
        connectors,
        ssr: false,
      })
    : createConfig({
        chains,
        transports,
        connectors,
        ssr: false,
      });

  return loading ? (
    <div>loading....</div>
  ) : (
    <WagmiProvider config={config}>{props.children}</WagmiProvider>
  );
}

export default WagmiSetup;
