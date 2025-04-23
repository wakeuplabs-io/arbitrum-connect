import HomeButton from "@/components/layout/home-button";
import { TransactionStatusHeader } from "@/components/transaction/status-header";
import { TransactionStatus } from "@/components/transaction/status-refactor";
import { Transaction, TransactionsStorageService } from "@/lib/transactions";
import { getArbitrumNetwork } from "@arbitrum/sdk";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";

export const Route = createFileRoute("/activity/")({
  component: ActivityScreen,
});

export const ActivityLoading = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="w-full flex flex-col text-left justify-between items-center rounded-2xl animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={`activity-skeleton-${i}`}
          className="w-full h-[90px] px-4 py-3 border-b border-neutral-200"
        >
          <div className="flex h-full items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-200" />{" "}
              {/* Avatar */}
              <div className="flex flex-col gap-1">
                <div className="w-24 h-4 rounded-md bg-neutral-200" />{" "}
                {/* Name */}
                <div className="w-16 h-3 rounded-md bg-neutral-200" />{" "}
                {/* Desc */}
              </div>
            </div>

            <div className="w-20 h-4 bg-neutral-200 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

function ActivityScreen() {
  const [loading, setLoading] = useState(false);
  const { address } = useAccount();
  const [txHistory, setTxHistory] = useState<Transaction[]>([]);
  const [statuses, setStatuses] = useState<Record<string, boolean>>({});

  // Ensures arbitrum netork exists on Arbitrum SDK
  useEffect(() => {
    let cancelled = false;

    function checkWithRetry(txId: string, chainId: number, attempt = 1) {
      try {
        getArbitrumNetwork(chainId); // throws if not registered
        if (!cancelled) {
          setStatuses((s) => ({ ...s, [txId]: true }));
        }
      } catch (err) {
        console.error(`Tx ${txId} attempt ${attempt} failed`, err);
        if (!cancelled) {
          if (attempt < 5)
            setTimeout(() => checkWithRetry(txId, chainId, attempt + 1), 1000);
        }
      }
    }

    txHistory.forEach((tx) => {
      setStatuses((s) => ({ ...s, [tx.bridgeHash]: false }));
      if (tx.childChainId != null) {
        checkWithRetry(tx.bridgeHash, tx.childChainId);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [txHistory]);

  useEffect(() => {
    if (address) {
      setLoading(true);
      TransactionsStorageService.getByAccount(address)
        .then((x) => setTxHistory(x))
        .finally(() => setLoading(false));
    }
  }, [address]);

  return (
    <div className="flex flex-col max-w-xl mx-auto">
      <div className="flex space-x-3 items-center mb-8">
        <h1 className="text-xl text-primary font-semibold">My activity</h1>
      </div>
      <div className="overflow-y-auto bg-neutral-50 h-[66vh]">
        <div className="join join-vertical flex flex-col text-left justify-between items-center border border-neutral-200 rounded-2xl">
          {loading ? (
            <ActivityLoading count={3} />
          ) : (
            txHistory.map((x, i) => (
              <div
                className="collapse collapse-arrow join-item"
                key={`collapsable-${i}`}
              >
                <TransactionStatusHeader tx={x} />
                <div className="collapse-content">
                  {statuses[x.bridgeHash] && <TransactionStatus tx={x} />}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      <HomeButton className="mt-6" />
    </div>
  );
}
