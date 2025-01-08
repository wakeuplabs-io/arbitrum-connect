import { createContext, useState, ReactNode, useEffect } from "react";
import { CustomChain } from "@/types";
import { Address, zeroAddress } from "viem";
import { defaultCustomChain, defaultCustomMainnet } from "@/lib/wagmi-config";

type CustomChainContextType = {
  chains: CustomChain[];
  loading: boolean;
  createChain: (userAddress: Address, chain: CustomChain) => void;
  deleteChain: (userAddress: Address, chainId: number) => void;
  getUserChains: (userAddress: Address) => void;
  getAllChains: () => void;
  selectedChain: CustomChain;
  selectedParentChain: CustomChain;
  setSelectedChain: React.Dispatch<React.SetStateAction<CustomChain>>;
  getChainById: (chainId: number) => CustomChain | null;
};

export const CustomChainContext = createContext<
  CustomChainContextType | undefined
>(undefined);

export function CustomChainProvider({ children }: { children: ReactNode }) {
  const [chains, setChains] = useState<CustomChain[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedChain, setSelectedChain] =
    useState<CustomChain>(defaultCustomChain);
  const [selectedParentChain, setSelectedParentChain] =
    useState<CustomChain>(defaultCustomMainnet);

    useEffect(() => {
      const initDefaultChains = async () => {
       console.log('initDefaultChains');
       const chainExists = await getChainById(defaultCustomChain.chainId);
       if (!chainExists){
         await createChain(zeroAddress, defaultCustomChain);
         await createChain(zeroAddress, defaultCustomMainnet);
       } 
      };
      initDefaultChains();
    },[]); 

  useEffect(() => {
    const getParent = async () => {
      if (selectedChain?.parentChainId) {
        const parentChain = await getChainById(selectedChain?.parentChainId);
        if (parentChain) setSelectedParentChain(parentChain);
      }
    };
    getParent();
  }, [selectedChain?.parentChainId]);

  const createChain = (userAddress: Address, chain: CustomChain) => {
    const storedChains = localStorage.getItem(`chains`);
    const parsedChains: CustomChain[] = storedChains
      ? JSON.parse(storedChains)
      : [];

    const chainExists = parsedChains.find(c => c.chainId === chain.chainId && c.user === userAddress);
    if(!chainExists) parsedChains.push({ ...chain, user: userAddress });
    localStorage.setItem(`chains`, JSON.stringify(parsedChains));
    setChains(parsedChains);
  };

  const deleteChain = (userAddress: Address, chainId: number) => {
    const storedChains = localStorage.getItem(`chains`);
    if (!storedChains) return;
    const parsedChains: CustomChain[] = JSON.parse(storedChains).filter(
      (chain: CustomChain) =>
        chain.chainId !== chainId && chain.user === userAddress,
    );
    localStorage.setItem(`chains`, JSON.stringify(parsedChains));
    setChains(parsedChains);
  };

  const getUserChains = (userAddress: Address) => {
    setLoading(true);
    const storedChains = localStorage.getItem(`chains`);
    const parsedChains: CustomChain[] = storedChains
      ? JSON.parse(storedChains)
      : [];
    setChains(
      parsedChains.filter((chain: CustomChain) => chain.user === userAddress),
    );
    setLoading(false);
  };

  const getAllChains = () => {
    setLoading(true);
    const storedChains = localStorage.getItem(`chains`);
    const parsedChains: CustomChain[] = storedChains
      ? JSON.parse(storedChains)
      : [];
    setChains(parsedChains);
    setLoading(false);
  };

  const getChainById = (chainId: number) => {
    setLoading(true);
    const storedChains = localStorage.getItem(`chains`);
    const parsedChains: CustomChain[] = storedChains
      ? JSON.parse(storedChains)
      : [];
    const chain = parsedChains.find(
      (chain: CustomChain) => chain.chainId === chainId,
    );
    return chain || null;
  };

  return (
    <CustomChainContext.Provider
      value={{
        chains,
        loading,
        createChain,
        deleteChain,
        getUserChains,
        getAllChains,
        selectedChain,
        setSelectedChain,
        selectedParentChain,
        getChainById,
      }}
    >
      {children}
    </CustomChainContext.Provider>
  );
}
