import { ClaimStatus } from "@/hooks/use-arbitrum-bridge";
import { Transaction } from "@/lib/transactions";
import EthereumIconCheck from "@/assets/ethereum-icon-check.svg";
import CustomChainService from "@/services/custom-chain-service";
import { formatEther } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import { CustomChain } from "@/types";
import ChainAvatar from "../chain-avatar";

export function TransactionStatusHeader(props: { tx: Transaction }) {
  const [txChildChain, setTxChildChain] = useState<CustomChain | null>();
  const [chainLoading, setChainLoading] = useState<boolean>(false);

  useEffect(() => {
    setChainLoading(true);
    CustomChainService.getChainById(props.tx.childChainId).then((x) => {
      setTxChildChain(x as CustomChain);
      setChainLoading(false);
    });
  }, []);

  if (txChildChain === null)
    return <>Missing configuration for chain id: {props.tx.childChainId}</>;
  if (chainLoading)
    return undefined;

  return (
    <>
      <input type="radio" name="accordion" />
      <div className="collapse-title flex justify-center items-cenetr justify-between text-lg h-10 pl-3 p-0 mt-5 mb-2.5 pr-8 gap-2 sm:pl-3">
        <div className="flex gap-3 items-center sm:gap-3">
          <div className="w-11 h-11 rounded">
            <ChainAvatar
              src={
                props.tx.claimStatus === ClaimStatus.CLAIMED
                  ? (txChildChain?.logoURI ?? EthereumIconCheck)
                  : (txChildChain?.logoURI)
              }
              alt={txChildChain?.name ?? "Ethereum"}
              size={44}
            />
          </div>
          <div className="overflow-hidden flex flex-col">
            <div className="truncate text-base">{txChildChain?.name}</div>
            <div className="text-sm">Withdrawal</div>
          </div>
        </div>
        <div className="text-base sm:text-lg truncate">
          {formatEther(BigInt(props.tx.amount)).slice(0, 8)}{" "}
          {txChildChain?.nativeCurrency.symbol ?? "ETH"}
        </div>
      </div>
    </>
  );
}
