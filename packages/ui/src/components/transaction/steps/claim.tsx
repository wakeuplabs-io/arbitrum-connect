import classNames from "classnames";
import { useMutation } from "@tanstack/react-query";
import { ChildToParentMessageWriter } from "@arbitrum/sdk";
import { useWeb3ClientContext } from "@/contexts/web3-client-context";
import useArbitrumBridge, { ClaimStatus } from "@/hooks/use-arbitrum-bridge";
import { Transaction } from "@/lib/transactions";
import { StatusStep } from "../status-step";
import { Countdown } from "../countdown";
import { useStepStatus } from "@/hooks/use-step-status";
import { Step, TransactionState } from "@/constants";
import { Chain } from "wagmi/chains";

export default function ClaimStep({
  transaction,
  onError,
  // Revise this
  fetchingQueries,
  l2ToL1Msg,
  updateTx,
  state,
  canClaim,
  parentChain,
}: {
  transaction: Transaction;
  onError: (error: Error) => void;
  fetchingClaimStatus: boolean;
  fetchingQueries: boolean;
  l2ToL1Msg: ChildToParentMessageWriter;
  updateTx: (tx: Transaction) => void;
  state: TransactionState;
  fetchingL2ToL1Msg: boolean;
  canClaim: boolean;
  parentChain: Chain;
}) {
  const { signer, claimFunds } = useArbitrumBridge({
    parentChainId: transaction.parentChainId,
    childChainId: transaction.childChainId,
  });
  const { childProvider } = useWeb3ClientContext();
  const { ACTIVE, DONE } = useStepStatus(Step.CLAIM, state);

  const claimFundsTx = useMutation({
    mutationFn: claimFunds,
    onError,
  });

  const claimTimeRemainingActive =
    transaction.claimStatus === ClaimStatus.PENDING &&
    state !== TransactionState.CLAIMABLE &&
    !fetchingQueries;

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
      done={DONE}
      active={ACTIVE}
      running={claimFundsTx.isPending || fetchingQueries}
      number={4}
      className="flex flex-col items-start pt-2 space-y-2 md:space-y-0 md:space-x-2 mb-4 md:flex-row md:items-center"
      title={`Claim funds on ${parentChain?.name}`}
      description={`After your transaction has been validated, you can track its status. Once the 7-day canonical bridge period on ${parentChain?.name} has elapsed, you will be able to claim your funds here.`}
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
