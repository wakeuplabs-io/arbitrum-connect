import { useQuery } from "@tanstack/react-query";
import { Transaction } from "@/lib/transactions";
import { useChains } from "../use-chains";

/**
 * Custom hook to fetch both parent and child chains associated with a transaction
 * @param transaction The transaction containing chain IDs
 * @returns Object containing both chains and loading/error states
 */
export const useGetTransactionChains = (transaction?: Transaction) => {
  const parentChainId = transaction?.parentChainId;
  const childChainId = transaction?.childChainId;
  const txId = transaction?.bridgeHash;
  const { getChainById } = useChains();

  const chainsQuery = useQuery({
    queryKey: ["tx-chains", txId],
    queryFn: () => {
      const [parentChain, childChain] = [
        getChainById(parentChainId!),
        getChainById(childChainId!),
      ];

      return { parentChain, childChain };
    },
    enabled: !!parentChainId && !!childChainId,
  });

  return {
    parentChain: chainsQuery.data?.parentChain,
    childChain: chainsQuery.data?.childChain,
    isLoading: chainsQuery.isLoading,
    isError: chainsQuery.isError,
    error: chainsQuery.error,
  };
};
