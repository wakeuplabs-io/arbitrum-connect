import { AddToCalendarButton } from "@/components/add-to-calendar";
import useArbitrumBridge from "@/hooks/use-arbitrum-bridge";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addHours } from "date-fns";
import { Transaction } from "@/lib/transactions";
import { StatusStep } from "../status-step";
import { useStepStatus } from "@/hooks/use-step-status";
import { Step, TransactionState } from "@/constants";
import { calculateRemainingHours } from "@/lib/helpers";

function ForceIncludeButton({
  transaction,
  onForce,
}: {
  transaction: Transaction;
  onForce: () => void;
}) {
  const { signer, isForceIncludePossible } = useArbitrumBridge({
    parentChainId: transaction.parentChainId,
    childChainId: transaction.childChainId,
  });

  const { data: canForceInclude, isFetching: fetchingForceIncludeStatus } =
    useQuery({
      queryKey: ["forceIncludeStatus", transaction.delayedInboxHash],
      queryFn: () => isForceIncludePossible(signer!),
      enabled: !!signer,
    });


  if (!canForceInclude || fetchingForceIncludeStatus) {
    return null;
  }

  return (
    <button onClick={onForce} className="btn btn-primary btn-sm">
      Force include
    </button>
  );
}

export default function ForceStep({
  transaction,
  onError,
  //Then remove
  fetchingClaimStatus,
  fetchingL2ToL1Msg,
  state,
}: {
  transaction: Transaction;
  onError: (error: Error) => void;
  fetchingClaimStatus: boolean;
  fetchingL2ToL1Msg: boolean;
  triggered: boolean;
  state: TransactionState;
}) {
  const { signer, forceInclude } = useArbitrumBridge({
    parentChainId: transaction.parentChainId,
    childChainId: transaction.childChainId,
  });
  const { ACTIVE, DONE } = useStepStatus(Step.FORCE_WITHDRAWAL, state);
  const remainingHours = transaction.delayedInboxTimestamp
    ? calculateRemainingHours(transaction.delayedInboxTimestamp)
    : undefined;

  const forceIncludeTx = useMutation({
    mutationFn: forceInclude,
    onError,
  });

  const isLoading =
    forceIncludeTx.isPending || fetchingClaimStatus || fetchingL2ToL1Msg;
  const isWating24 = !!remainingHours && remainingHours > 0;

  function onForce() {
    if (!signer) return;

    forceIncludeTx.mutate(signer);
  }

  return (
    <StatusStep
      done={DONE}
      active={ACTIVE}
      running={isLoading}
      number={3}
      title="Force transaction"
      description="If after 24 hours your Arbitrum transaction hasn't been mined, you can push it forward manually with some extra fee in ethereum"
      className="flex flex-col items-start pt-2 space-y-2 md:space-y-0 md:space-x-2 mb-4 md:flex-row md:items-center"
    >
      {state === TransactionState.FORCEABLE ? (
        <ForceIncludeButton onForce={onForce} transaction={transaction} />
      ) : null}

      {isWating24 && !isLoading ? (
        <>
          <a className="text-sm font-semibold">
            ~ {remainingHours} hours remaining
          </a>
          <AddToCalendarButton
            event={{
              title: "Push forward your transaction",
              description:
                "Wait is over, if your transaction hasn't go through by now, you can force include it from Arbitrum connect.",
              startDate: addHours(transaction.delayedInboxTimestamp!, 24),
              endDate: addHours(transaction.delayedInboxTimestamp!, 25),
            }}
          />
        </>
      ) : null}
    </StatusStep>
  );
}
