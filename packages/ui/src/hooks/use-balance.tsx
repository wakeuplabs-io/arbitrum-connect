import { useWeb3Client } from "@/contexts/web3-client-context";
import { CustomChain } from "@/types";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export default function useBalance(chain: CustomChain) {
  const { address } = useAccount();
  const [balanceOnArbitrum, setBalanceOnArbitrum] = useState("");
  const { provider } = useWeb3Client(chain);

  useEffect(() => {
    const getBalance = async () => {
      if (address && provider) {
        const rawBalance = await provider.getBalance(address);
        const balance = ethers.utils.formatEther(rawBalance);

        setBalanceOnArbitrum(balance);
      } else setBalanceOnArbitrum("0");
    };

    getBalance();
  }, [address, provider]);
  return balanceOnArbitrum;
}
