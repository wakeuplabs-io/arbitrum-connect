import { useWeb3Client } from "@/contexts/web3-client-context";
import useArbitrumBridge, { ClaimStatus } from "@/hooks/use-arbitrum-bridge";
import { Transaction, TransactionsStorageService } from "@/lib/transactions";
import { getTimestampFromTxHash } from "@/lib/tx-actions";
import { CustomChain } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export const useTransaction = ({
  tx,
  enabled,
  childChain,
  parentChain,
}: {
  tx: Transaction;
  enabled: boolean;
  childChain?: CustomChain;
  parentChain?: CustomChain;
}) => {
  const [transaction, setTransaction] = useState<Transaction>(tx);
  const { signer, getClaimStatus, getL2toL1Msg } = useArbitrumBridge({
    parentChainId: transaction.parentChainId,
    childChainId: transaction.childChainId,
  });
  const { provider: childProvider } = useWeb3Client(childChain);
  const { client: parentClient } = useWeb3Client(parentChain);

  const {
    data: delayedInboxTxTimestamp,
    isFetching: fetchingInboxTxTimestamp,
  } = useQuery({
    queryKey: ["delayedInboxTimestamp", transaction.delayedInboxHash],
    queryFn: () =>
      getTimestampFromTxHash(transaction.delayedInboxHash!, parentClient!),
    enabled:
      enabled &&
      !!parentClient &&
      transaction.delayedInboxHash !== undefined &&
      !transaction.delayedInboxTimestamp,
  });

  const { data: l2ToL1Msg, isFetching: fetchingL2ToL1Msg } = useQuery({
    queryKey: ["l2ToL1Msg", transaction.bridgeHash],
    queryFn: () =>
      getL2toL1Msg(transaction.bridgeHash, childProvider!, signer!),
    enabled:
      enabled &&
      !!signer &&
      !!childProvider &&
      !!transaction.delayedInboxTimestamp &&
      transaction.claimStatus !== ClaimStatus.CLAIMED,
    staleTime: Infinity,
  });

  const { data: claimStatusData, isFetching: fetchingClaimStatus } = useQuery({
    queryKey: ["claimStatus", transaction.bridgeHash],
    queryFn: () => getClaimStatus(childProvider!, l2ToL1Msg!),
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

  async function updateTx(updatedTx: Transaction) {
    setTransaction(updatedTx);
    await TransactionsStorageService.update(updatedTx);
  }

  const canClaim =
    transaction.claimStatus === ClaimStatus.CLAIMABLE &&
    !fetchingClaimStatus &&
    !fetchingL2ToL1Msg;

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
