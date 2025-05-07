import { ArrowUpRight } from "lucide-react";
import { StatusStep } from "../status-step";
import { Transaction } from "@/lib/transactions";
import { useEffect, useState } from "react";
import { CustomChain } from "@/types";
import { useChains } from "@/hooks/use-chains";

export default function InitiateWithdrawal({
  transaction,
  childChain,
}: {
  transaction: Transaction;
  childChain?: CustomChain;
}) {
  const [l2TxUrl, setL2TxUrl] = useState("");
  const { getChainById } = useChains();
  useEffect(() => {
    const childChain = getChainById(transaction.childChainId);
    const txUrl = `${childChain?.explorer?.default.url}/tx/${transaction.bridgeHash}`;
    setL2TxUrl(txUrl);
  }, []);

  return (
    <StatusStep
      done
      number={1}
      title="Initiate Withdraw"
      description={`Your withdraw transaction in ${childChain?.name}`}
      className="pt-2 md:flex md:space-x-4 mb-4"
    >
      <a
        href={l2TxUrl}
        target="_blank"
        className="link text-sm flex space-x-1 items-center"
        rel="noreferrer"
      >
        <span>{childChain?.name} tx </span>
        <ArrowUpRight className="h-3 w-3" />
      </a>
    </StatusStep>
  );
}
