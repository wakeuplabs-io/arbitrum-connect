import React from "react";
import { Address } from "viem";
import classNames from "classnames";
import { ArrowUpRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

// Hooks
import useArbitrumBridge from "@/hooks/use-arbitrum-bridge";

// Constants
import { l1Scan } from "@/constants";

// Libs
import { Transaction } from "@/lib/transactions";

// Steps
import { StatusStep } from "../status-step";

enum Status {
  ACTIVE = 0,
  PENDING = 1,
  COMPLETED = 2,
}

export default function ConfirmWithdrawal({
  transaction,
  onError,
  fetchingInboxTxTimestamp: isLoading,
  updateTx,
}: {
  transaction: Transaction;
  onError: (error: Error) => void;
  fetchingInboxTxTimestamp: boolean;
  updateTx: (tx: Transaction) => void;
}) {
  const { signer, pushChildTxToParent } = useArbitrumBridge();

  const l1TxUrl = `${l1Scan}/tx/${transaction.delayedInboxHash}`;
  const confirmTx = useMutation({
    mutationFn: pushChildTxToParent,
    onError,
  });

  const status = React.useMemo(() => {
    if (!transaction.delayedInboxHash) {
      return Status.ACTIVE;
    }

    if (transaction.delayedInboxHash && !transaction.delayedInboxTimestamp) {
      return Status.PENDING;
    }

    return Status.COMPLETED;
  }, []);

  const isRunning =
    confirmTx.isPending || isLoading || status === Status.PENDING;

  function onConfirm() {
    if (!signer) return;

    confirmTx.mutate(
      {
        l2SignedTx: transaction.bridgeHash,
        parentSigner: signer,
      },
      {
        onSuccess: async (inboxTx) => {
          let updatedTx = {
            ...transaction,
            delayedInboxHash: inboxTx.hash as Address,
          };
          updateTx(updatedTx);

          await inboxTx.wait();
          updateTx({
            ...updatedTx,
            delayedInboxTimestamp: Date.now(),
          })
        },
      }
    );
  }

  return (
    <StatusStep
      done={!!transaction.delayedInboxTimestamp}
      active={status === Status.ACTIVE}
      running={isRunning}
      number={2}
      title="Confirm Withdraw"
      description="Send the Arbitrum withdraw transaction through the delayed inbox"
      className="pt-2 space-y-2 md:space-y-0 md:space-x-2 mb-4 flex items-start flex-col md:flex-row md:items-center"
    >
      {[Status.ACTIVE, Status.PENDING].includes(status) && !isLoading && (
        <button
          onClick={onConfirm}
          className={classNames("btn btn-primary btn-sm", {
            "opacity-50": confirmTx.isPending,
          })}
          disabled={confirmTx.isPending}
        >
          Confirm
        </button>
      )}

      {status === Status.COMPLETED && (
        <a
          href={l1TxUrl}
          target="_blank"
          className="link text-sm flex space-x-1 items-center "
        >
          <span>Ethereum delayed inbox tx </span>
          <ArrowUpRight className="h-3 w-3" />
        </a>
      )}
    </StatusStep>
  );
}
