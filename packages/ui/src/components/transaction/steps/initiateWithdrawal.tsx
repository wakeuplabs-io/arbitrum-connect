import { ArrowUpRight } from "lucide-react";
import { StatusStep } from "../status-step";
import { Transaction } from "@/lib/transactions";
import CustomChainService from "@/services/custom-chain-service";
import { useEffect, useState } from "react";
import { useSelectedChain } from "@/hooks/use-selected-chain";

export default function InitiateWithdrawal({
  transaction,
}: {
  transaction: Transaction;
}) {
  const [l2TxUrl, setL2TxUrl] = useState("");
  const { selectedChain } = useSelectedChain();
  useEffect(() => {
    CustomChainService.getChainById(transaction.childChainId).then((x) => {
      const txUrl = `${x?.explorer?.default.url}/tx/${transaction.bridgeHash}`;
      setL2TxUrl(txUrl);
    });
  }, []);

  return (
    <StatusStep
      done
      number={1}
      title="Initiate Withdraw"
      description={`Your withdraw transaction in ${selectedChain.name}`}
      className="pt-2 md:flex md:space-x-4 mb-4"
    >
      <a
        href={l2TxUrl}
        target="_blank"
        className="link text-sm flex space-x-1 items-center"
        rel="noreferrer"
      >
        <span>{selectedChain.name} tx </span>
        <ArrowUpRight className="h-3 w-3" />
      </a>
    </StatusStep>
  );
}
