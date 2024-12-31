import { TransactionState } from "@/constants";
import { Transaction } from "@/lib/transactions";
import { ClaimStatus } from "./use-arbitrum-bridge";

export function useTransactionStatus(
  transaction: Transaction,
): TransactionState {
  if (!!transaction.delayedInboxHash && !!transaction.delayedInboxTimestamp) {
    return TransactionState.CONFIRMED;
  }

  if (
    !!transaction.delayedInboxTimestamp &&
    transaction.claimStatus === ClaimStatus.PENDING
  ) {
    return TransactionState.FORCEABLE;
  }
  const withdrawCompleted =
    !transaction.delayedInboxHash || !transaction.delayedInboxTimestamp;
  if (transaction.claimStatus !== ClaimStatus.CLAIMED && !withdrawCompleted)
    return TransactionState.CLAIMABLE;

  if (withdrawCompleted) {
    return TransactionState.COMPLETED;
  }

  return TransactionState.INITIATED;
}
