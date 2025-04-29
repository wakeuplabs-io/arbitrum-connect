import HomeButton from "@/components/layout/home-button";
import { TransactionStatusHeader } from "@/components/transaction/status-header";
import { TransactionStatus } from "@/components/transaction/status-refactor";
import { Transaction, TransactionsStorageService } from "@/lib/transactions";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export const Route = createFileRoute("/activity/")({
  component: ActivityScreen,
});

function ActivityScreen() {
  const { address } = useAccount();
  const [txHistory, setTxHistory] = useState<Transaction[]>([]);

  useEffect(() => {
    if (address)
      TransactionsStorageService.getByAccount(address).then((x) =>
        setTxHistory(x),
      );
  }, [address]);

  return (
    <div className="flex flex-col max-w-xl mx-auto">
      <div className="flex space-x-3 items-center mb-8">
        <h1 className="text-xl text-primary font-semibold">My activity</h1>
      </div>
      <div className="overflow-y-auto bg-neutral-50 h-[66vh]">
        <div className="join join-vertical flex flex-col text-left justify-between items-center border border-neutral-200 rounded-2xl">
          {txHistory.map((x, i) => (
            <div
              className="collapse collapse-arrow join-item"
              key={`collapsable-${i}`}
            >
              <TransactionStatusHeader tx={x} />
              <div className="collapse-content">
                <TransactionStatus tx={x} /* isActive={false} */ />
              </div>
            </div>
          ))}
        </div>
      </div>
      <HomeButton className="mt-6" />
    </div>
  );
}
