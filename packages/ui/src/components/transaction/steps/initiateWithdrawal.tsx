import { ArrowUpRight } from "lucide-react";
import { StatusStep } from "../status-step";
import { Transaction } from "@/lib/transactions";
import CustomChainService from "@/services/custom-chain-service";

export default function InitiateWithdrawal({
  transaction,
}: {
  transaction: Transaction;
}) {
  const childChain = CustomChainService.getChainById(transaction.childChainId);

  const l2TxUrl = `${childChain?.explorer.default.url}/tx/${transaction.bridgeHash}`;
 
  return (
    <StatusStep
      done
      number={1}
      title="Initiate Withdraw"
      description="Your withdraw transaction in Arbitrum"
      className="pt-2 md:flex md:space-x-4 mb-4"
    >
      <a
        href={l2TxUrl}
        target="_blank"
        className="link text-sm flex space-x-1 items-center"
      >
        <span>Arbitrum tx </span>
        <ArrowUpRight className="h-3 w-3" />
      </a>
    </StatusStep>
  );
}
