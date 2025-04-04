import { Address } from "viem";
import classNames from "classnames";
import { ArrowUpRight } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import useArbitrumBridge from "@/hooks/use-arbitrum-bridge";
import { Step, TransactionState } from "@/constants";
import { Transaction } from "@/lib/transactions";
import { StatusStep } from "../status-step";
import { useStepStatus } from "@/hooks/use-step-status";
import CustomChainService from "@/services/custom-chain-service";
import { useEffect, useState } from "react";
import { Chain } from "wagmi/chains";

export default function ConfirmWithdrawal({
  transaction,
  onError,
  fetchingInboxTxTimestamp: isLoading,
  updateTx,
  state,
  parentChain,
}: {
  transaction: Transaction;
  onError: (error: Error) => void;
  fetchingInboxTxTimestamp: boolean;
  updateTx: (tx: Transaction) => Promise<void>;
  state: TransactionState;
  parentChain: Chain;
}) {
  const [parentTxUrl, setParentTxUrl] = useState("");
  const { signer, pushChildTxToParent } = useArbitrumBridge({
    parentChainId: transaction.parentChainId,
    childChainId: transaction.childChainId,
  });
  const { ACTIVE, DONE } = useStepStatus(Step.CONFIRM_WITHDRAWAL, state);

  const confirmTx = useMutation({
    mutationFn: pushChildTxToParent,
    onError,
  });

  const isRunning =
    confirmTx.isPending ||
    isLoading ||
    (transaction.delayedInboxHash && !transaction.delayedInboxTimestamp);

  function onConfirm() {
    if (!signer) return;

    confirmTx.mutate(
      {
        childSignedTx: transaction.bridgeHash,
        parentSigner: signer,
      },
      {
        onSuccess: async (inboxTx) => {
          const updatedTx = {
            ...transaction,
            delayedInboxHash: inboxTx.hash as Address,
          };
          await updateTx(updatedTx);

          await inboxTx.wait();
          updateTx({
            ...updatedTx,
            delayedInboxTimestamp: Date.now(),
          });
          CustomChainService.getChainById(transaction.parentChainId).then(
            (x) => {
              const txUrl = `${x?.explorer?.default.url}/tx/${inboxTx.hash}`;

              setParentTxUrl(txUrl);
            }
          );
        },
      }
    );
  }

  useEffect(() => {
    CustomChainService.getChainById(transaction.parentChainId).then((x) => {
      const txUrl = `${x?.explorer?.default.url}/tx/${transaction.delayedInboxHash}`;
      setParentTxUrl(txUrl);
    });
  }, []);

  return (
    <StatusStep
      done={DONE}
      active={ACTIVE}
      running={isRunning}
      number={2}
      title="Confirm Withdraw"
      description={`Send the ${parentChain.name} withdraw transaction through the delayed inbox`}
      className="pt-2 space-y-2 md:space-y-0 md:space-x-2 mb-4 flex items-start flex-col md:flex-row md:items-center"
    >
      {ACTIVE && (
        <button
          onClick={onConfirm}
          className={classNames("btn btn-primary btn-sm", {
            "opacity-50": isRunning,
          })}
          disabled={isRunning}
        >
          Confirm
        </button>
      )}

      {DONE && (
        <a
          href={parentTxUrl}
          target="_blank"
          className="link text-sm flex space-x-1 items-center "
          rel="noreferrer"
        >
          <span>Parent delayed inbox tx </span>
          <ArrowUpRight className="h-3 w-3" />
        </a>
      )}
    </StatusStep>
  );
}
