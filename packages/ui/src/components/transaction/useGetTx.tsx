import { useWeb3ClientContext } from "@/contexts/web3-client-context";
import useArbitrumBridge, { ClaimStatus } from "@/hooks/use-arbitrum-bridge";
import { Transaction, transactionsStorageService } from "@/lib/transactions";
import { getTimestampFromTxHash } from "@/lib/tx-actions";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

// TODO: convert this to a context
export const useTransaction = ({ tx, enabled }: { tx: Transaction; enabled: boolean }) => {
  const [transaction, setTransaction] = useState<Transaction>(tx);
  const { publicParentClient, childProvider } = useWeb3ClientContext();
  const { signer, getClaimStatus, getL2toL1Msg } = useArbitrumBridge();

  const { data: delayedInboxTxTimestamp, isFetching: fetchingInboxTxTimestamp } = useQuery({
    queryKey: ["delayedInboxTimestamp", transaction.delayedInboxHash],
    queryFn: () => getTimestampFromTxHash(transaction.delayedInboxHash!, publicParentClient),
    enabled: enabled && transaction.delayedInboxHash !== undefined && !transaction.delayedInboxTimestamp,
  });

  const { data: l2ToL1Msg, isFetching: fetchingL2ToL1Msg } = useQuery({
    queryKey: ["l2ToL1Msg", transaction.bridgeHash],
    queryFn: () => getL2toL1Msg(transaction.bridgeHash, childProvider, signer!),
    enabled:
      enabled && !!signer && !!transaction.delayedInboxTimestamp && transaction.claimStatus !== ClaimStatus.CLAIMED,
    staleTime: Infinity,
  });

  const { data: claimStatusData, isFetching: fetchingClaimStatus } = useQuery({
    queryKey: ["claimStatus", transaction.bridgeHash],
    queryFn: () => getClaimStatus(childProvider, l2ToL1Msg!),
    enabled: !!l2ToL1Msg && !!childProvider && !!transaction.bridgeHash,
    staleTime: 60000,
    refetchOnMount: false,
  });

  useEffect(() => {
    if (claimStatusData && claimStatusData !== ClaimStatus.PENDING)
      updateTx({ ...transaction, claimStatus: claimStatusData });
  }, [claimStatusData]);

  useEffect(() => {
    if (delayedInboxTxTimestamp)
      updateTx({
        ...transaction,
        delayedInboxTimestamp: delayedInboxTxTimestamp,
      });
  }, []);

  function updateTx(updatedTx: Transaction) {
    setTransaction(updatedTx);
    transactionsStorageService.update(updatedTx);
  }

  const canClaim = transaction.claimStatus === ClaimStatus.CLAIMABLE && !fetchingClaimStatus && !fetchingL2ToL1Msg;

  return {
    transaction,
    updateTx,
    l2ToL1Msg,

    canClaim,
    fetchingInboxTxTimestamp,
    fetchingClaimStatus,
    fetchingL2ToL1Msg,
  };
};
