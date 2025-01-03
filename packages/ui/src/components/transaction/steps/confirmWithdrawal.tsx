import { Address } from "viem";
import classNames from "classnames";
import { ArrowUpRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import useArbitrumBridge from "@/hooks/use-arbitrum-bridge";
import { l1Scan, Step, TransactionState } from "@/constants";
import { Transaction } from "@/lib/transactions";
import { StatusStep } from "../status-step";
import { useStepStatus } from "@/hooks/use-step-status";

export default function ConfirmWithdrawal({
  transaction,
  onError,
  fetchingInboxTxTimestamp: isLoading,
  updateTx,
  state
}: {
  transaction: Transaction;
  onError: (error: Error) => void;
  fetchingInboxTxTimestamp: boolean;
  updateTx: (tx: Transaction) => void;
  state: TransactionState;
}) {
  const { signer, pushChildTxToParent } = useArbitrumBridge();
  const { ACTIVE, DONE } = useStepStatus(Step.CONFIRM_WITHDRAWAL, state);
  const l1TxUrl = `${l1Scan}/tx/${transaction.delayedInboxHash}`;
  const confirmTx = useMutation({
    mutationFn: pushChildTxToParent,
    onError,
  });

  const isRunning =
    confirmTx.isPending || isLoading || (transaction.delayedInboxHash && !transaction.delayedInboxTimestamp);

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
      done={DONE}
      active={ACTIVE}
      running={isRunning}
      number={2}
      title="Confirm Withdraw"
      description="Send the Arbitrum withdraw transaction through the delayed inbox"
      className="pt-2 space-y-2 md:space-y-0 md:space-x-2 mb-4 flex items-start flex-col md:flex-row md:items-center"
    >
      {ACTIVE && !isLoading && (
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

      {DONE && (
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
