import { useSelectedChain } from "@/hooks/use-selected-chain";
import { ethers } from "ethers";
import React, { createContext, useContext, useMemo } from "react";
import { createPublicClient, defineChain, http, PublicClient } from "viem";

type Web3ClientContextValue = {
  publicParentClient: PublicClient;
  publicChildClient: PublicClient;
  parentProvider: ethers.providers.JsonRpcProvider;
  childProvider: ethers.providers.JsonRpcProvider;
};

const Web3ClientContext = createContext<Web3ClientContextValue | undefined>(
  undefined,
);

interface Web3ClientProviderProps {
  children: React.ReactNode;
}

export const Web3ClientProvider: React.FC<Web3ClientProviderProps> = ({
  children,
}) => {
  const { selectedChain, selectedParentChain } = useSelectedChain();
	console.log("Web3ClientProvider", selectedChain, selectedParentChain)
  const parentChainSelected = useMemo(
    () =>
      defineChain({
        ...selectedParentChain,
        id: selectedParentChain.chainId,
      }),
    [selectedParentChain?.chainId],
  );

  const childChainSelected = useMemo(
    () =>
      defineChain({
        ...selectedChain,
        id: selectedChain.chainId,
      }),
    [selectedChain?.chainId],
  );
  const publicParentClient = useMemo(
    () =>
      createPublicClient({
        chain: parentChainSelected,
        transport: http(parentChainSelected.rpcUrls.default.http[0]),
      }),
    [parentChainSelected.chainId],
  );

  const publicChildClient = useMemo(
    () =>
      createPublicClient({
        chain: childChainSelected,
        transport: http(childChainSelected.rpcUrls.default.http[0]),
      }),
    [childChainSelected.chainId],
  );

  const parentProvider = useMemo(
    () =>
      new ethers.providers.JsonRpcProvider(
        parentChainSelected.rpcUrls.default.http[0],
      ),
    [parentChainSelected.chainId],
  );
  const childProvider = useMemo(
    () =>
      new ethers.providers.JsonRpcProvider(
        childChainSelected.rpcUrls.default.http[0],
      ),
    [childChainSelected.chainId],
  );

  const values = {
    publicParentClient,
    publicChildClient,
    parentProvider,
    childProvider,
  };

  return (
    <Web3ClientContext.Provider value={values}>
      {children}
    </Web3ClientContext.Provider>
  );
};

export const useWeb3ClientContext = (): Web3ClientContextValue => {
  const context = useContext(Web3ClientContext);

  if (!context) {
    throw new Error("Web3ClientContext failed to initialize");
  }

  return context;
};
