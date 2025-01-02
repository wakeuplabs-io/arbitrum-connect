import { TransactionState } from "@/constants";
import { Transaction } from "@/lib/transactions";
import { ClaimStatus } from "./use-arbitrum-bridge";

export function useTransactionStatus(
  transaction: Transaction,
): TransactionState {
  const withdrawCompleted = transaction.claimStatus === ClaimStatus.CLAIMED;
    !transaction.delayedInboxHash && !transaction.delayedInboxTimestamp;
  if (transaction.claimStatus === ClaimStatus.CLAIMABLE && !withdrawCompleted)
    return TransactionState.CLAIMABLE;

  if (withdrawCompleted) {
    return TransactionState.COMPLETED;
  }

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
