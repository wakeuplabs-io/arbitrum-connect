import classNames from "classnames";
import { useMutation } from "@tanstack/react-query";
import { ChildToParentMessageWriter } from "@arbitrum/sdk";

// Hooks
import { useWeb3ClientContext } from "@/contexts/web3-client-context";
import useArbitrumBridge, { ClaimStatus } from "@/hooks/use-arbitrum-bridge";

// Libs
import { Transaction } from "@/lib/transactions";

// Steps
import { StatusStep } from "../status-step";
import { Countdown } from "../countdown";

export default function ClaimStep({
  transaction,
  onError,
  // Revise this
  fetchingQueries,
  forceStepActive,
  canClaim,
  l2ToL1Msg,
  updateTx,
}: {
  transaction: Transaction;
  onError: (error: Error) => void;
  fetchingClaimStatus: boolean;
  fetchingQueries: boolean;
  forceStepActive: boolean;
  canClaim: boolean;
  l2ToL1Msg: ChildToParentMessageWriter;
  updateTx: (tx: Transaction) => void;
}) {
  const { signer, claimFunds } = useArbitrumBridge();
  const { childProvider } = useWeb3ClientContext();

  const claimFundsTx = useMutation({
    mutationFn: claimFunds,
    onError,
  });

  const claimTimeRemainingActive =
    transaction.claimStatus === ClaimStatus.PENDING &&
    !canClaim &&
    !fetchingQueries;

  const withdrawCompleted =
    !transaction.delayedInboxHash || !transaction.delayedInboxTimestamp;

  const claimStepActive =
    transaction.claimStatus !== ClaimStatus.CLAIMED &&
    !forceStepActive &&
    !withdrawCompleted;

    console.log({ transaction, forceStepActive, withdrawCompleted })

  function onClaim() {
    if (!signer) return;

    claimFundsTx.mutate(
      {
        l2ToL1Msg,
        parentSigner: signer,
        childProvider,
      },
      {
        onSuccess: () => {
          updateTx({
            ...transaction,
            claimStatus: ClaimStatus.CLAIMED,
          });
        },
      }
    );
  }

  return (
    <StatusStep
      done={transaction.claimStatus === ClaimStatus.CLAIMED}
      active={claimStepActive}
      running={claimFundsTx.isPending || fetchingQueries}
      number={4}
      className="flex flex-col items-start pt-2 space-y-2 md:space-y-0 md:space-x-2 mb-4 md:flex-row md:items-center"
      title="Claim funds on Ethereum"
      description="After your transaction has been validated, you can track its status. Once the 7-day canonical bridge period on Arbitrum has elapsed, you will be able to claim your funds here."
      lastStep
    >
      {claimTimeRemainingActive && (
        <Countdown
          startTimestamp={transaction.delayedInboxTimestamp}
          daysToAdd={7}
        />
      )}
      {canClaim && (
        <button
          onClick={onClaim}
          className={classNames("btn btn-primary btn-sm", {
            "opacity-50": claimFundsTx.isPending,
          })}
          disabled={claimFundsTx.isPending}
        >
          Claim funds
        </button>
      )}
    </StatusStep>
  );
}
