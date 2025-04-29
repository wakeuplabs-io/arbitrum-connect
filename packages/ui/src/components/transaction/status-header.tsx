import { ClaimStatus } from "@/hooks/use-arbitrum-bridge";
import { Transaction } from "@/lib/transactions";
import EthereumIconCheck from "@/assets/ethereum-icon-check.svg";
import EthereumIcon from "@/assets/ethereum-icon.svg";
import CustomChainService from "@/services/custom-chain-service";
import { formatEther } from "ethers/lib/utils";
import { useEffect, useState } from "react";
import { CustomChain } from "@/types";

export function TransactionStatusHeader(props: { tx: Transaction }) {
  const [txChildChain, setTxChildChain] = useState<CustomChain | null>();

  useEffect(() => {
    CustomChainService.getChainById(props.tx.childChainId).then((x) => {
      setTxChildChain(x);
    });
  }, []);

  if (txChildChain === null)
    return <>Missing configuration for chain id: {props.tx.childChainId}</>;

  return (
    <>
      <input type="radio" name="accordion" />
      <div className="collapse-title flex justify-center items-center justify-between text-lg h-10 pl-3 p-0 mt-5 mb-2.5 pr-8 gap-2 sm:pl-3">
        <div className="flex gap-3 items-center sm:gap-3">
          {props.tx.claimStatus === ClaimStatus.CLAIMED ? (
            <img src={EthereumIconCheck} />
          ) : (
            <img src={EthereumIcon} />
          )}
          <div className="overflow-hidden flex flex-col">
            <div className="truncate text-base">{txChildChain?.name}</div>
            <div className="text-sm">Withdrawal</div>
          </div>
        </div>
        <div className="text-base sm:text-lg truncate">
          {formatEther(BigInt(props.tx.amount)).slice(0, 8)} ETH
        </div>
      </div>
    </>
  );
}
