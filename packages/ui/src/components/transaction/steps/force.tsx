import React from "react";
import { AddToCalendarButton } from "@/components/add-to-calendar";
import useArbitrumBridge, { ClaimStatus } from "@/hooks/use-arbitrum-bridge";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addDays, addHours, differenceInHours } from "date-fns";
import { Transaction } from "@/lib/transactions";
import { StatusStep } from "../status-step";

function calculateRemainingHours(timestamp: number): number {
  const dueDate = addDays(new Date(timestamp), 1);
  const remainingHours = differenceInHours(dueDate, new Date());

  return Math.max(0, remainingHours);
}

enum Status {
  FORCE_INCLUDE = 0,
  RUNNING,
  REMAINING_HOURS,
  DONE,
}

function ForceIncludeButton({
  transaction,
  onForce,
}: {
  transaction: Transaction;
  onForce: () => void;
}) {
  const { signer, isForceIncludePossible } = useArbitrumBridge();

  const { data: canForceInclude, isFetching: fetchingForceIncludeStatus } =
    useQuery({
      queryKey: ["forceIncludeStatus", transaction.delayedInboxHash],
      queryFn: () => isForceIncludePossible(signer!),
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
}: {
  transaction: Transaction;
  onError: (error: Error) => void;
  fetchingClaimStatus: boolean;
  fetchingL2ToL1Msg: boolean;
  triggered: boolean;
}) {
  const { signer, forceInclude } = useArbitrumBridge();

  const remainingHours = transaction.delayedInboxTimestamp
    ? calculateRemainingHours(transaction.delayedInboxTimestamp)
    : undefined;

  const forceIncludeTx = useMutation({
    mutationFn: forceInclude,
    onError,
  });

  const isActive = // !forceStepDone &&
    !!transaction.delayedInboxTimestamp &&
    transaction.claimStatus === ClaimStatus.PENDING;

  const status = React.useMemo(() => {
    const isLoading = forceIncludeTx.isPending || fetchingClaimStatus;
    if (isLoading) {
      return Status.RUNNING;
    }

    if (transaction.claimStatus === ClaimStatus.PENDING) {
      return Status.FORCE_INCLUDE;
    }

    if (!remainingHours || remainingHours > 0) {
      return Status.REMAINING_HOURS;
    }

    const fetchingQueries = fetchingClaimStatus && fetchingL2ToL1Msg;

    if (
      [ClaimStatus.CLAIMED, ClaimStatus.CLAIMABLE].includes(
        transaction.claimStatus
      ) ||
      !fetchingQueries
    )
      return Status.DONE;
  }, []);

  function onForce() {
    if (!signer) return;

    forceIncludeTx.mutate(signer);
  }

  return (
    <StatusStep
      done={status === Status.DONE}
      active={isActive}
      running={status === Status.RUNNING}
      number={3}
      title="Force transaction"
      description="If after 24 hours your Arbitrum transaction hasn't been mined, you can push it forward manually with some extra fee in ethereum"
      className="flex flex-col items-start pt-2 space-y-2 md:space-y-0 md:space-x-2 mb-4 md:flex-row md:items-center"
    >
      {status === Status.FORCE_INCLUDE && (
        <ForceIncludeButton onForce={onForce} transaction={transaction} />
      )}

      {status === Status.REMAINING_HOURS && (
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
      )}
    </StatusStep>
  );
}
