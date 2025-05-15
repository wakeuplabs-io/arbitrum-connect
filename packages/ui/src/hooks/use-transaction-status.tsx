import { TransactionState } from "@/constants";
import { Transaction } from "@/lib/transactions";
import { ClaimStatus } from "./use-arbitrum-bridge";

export function useTransactionStatus(
  transaction: Transaction
): TransactionState {
  const withdrawCompleted = transaction.claimStatus === ClaimStatus.CLAIMED; //&& !transaction.delayedInboxHash && !transaction.delayedInboxTimestamp;
  if (withdrawCompleted) {
    return TransactionState.COMPLETED;
  }
  if ([ClaimStatus.CLAIMABLE, ClaimStatus.FORCE_INCLUDE_SKIPPABLE].includes(transaction.claimStatus) && !withdrawCompleted)
    return TransactionState.CLAIMABLE;
  if (
    !!transaction.delayedInboxTimestamp &&
    transaction.claimStatus === ClaimStatus.PENDING
  ) {
    return TransactionState.FORCEABLE;
  }

  if (!!transaction.delayedInboxHash && !!transaction.delayedInboxTimestamp) {
    return TransactionState.CONFIRMED;
  }

  return TransactionState.INITIATED;
}
