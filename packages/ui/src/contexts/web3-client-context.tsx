import { useCustomChainContext } from "@/hooks/use-custom-chain";
import { ethers } from "ethers";
import React, { createContext, useContext } from "react";
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
	const { selectedChain, selectedParentChain } = useCustomChainContext();

	const parentChainSelected = defineChain({
			...selectedParentChain,
			id: selectedParentChain.chainId,
	});

	const childChainSelected = defineChain({
			...selectedChain,
			id: selectedChain.chainId,
	});

	const publicParentClient = createPublicClient({
			chain: parentChainSelected,
			transport: http(parentChainSelected.rpcUrls.default.http[0]),
	});
	const publicChildClient = createPublicClient({
			chain: childChainSelected,
			transport: http(childChainSelected.rpcUrls.default.http[0]),
	});
	const parentProvider = new ethers.providers.JsonRpcProvider(
			parentChainSelected.rpcUrls.default.http[0],
	);
	const childProvider = new ethers.providers.JsonRpcProvider(
		childChainSelected.rpcUrls.default.http[0],
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
