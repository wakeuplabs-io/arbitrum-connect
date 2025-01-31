import { useEffect, useRef, useState } from "react";
import { Transaction } from "@/lib/transactions";
import { useAlertContext } from "@/contexts/alert/alert-context";
import useOnScreen from "@/hooks/use-on-screen";
import { LEARN_MORE_URI } from "@/constants";
import { useTransaction } from "./useGetTx";
import InitiateWithdrawal from "./steps/initiateWithdrawal";
import ConfirmWithdrawal from "./steps/confirmWithdrawal";
import ClaimStep from "./steps/claim";
import ForceStep from "./steps/force";
import { useTransactionStatus } from "@/hooks/use-transaction-status";

export function TransactionStatus({ tx }: { tx: Transaction }) {
  const [triggered, setTriggered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useOnScreen(ref);
  const { setError } = useAlertContext();

  const {
    transaction,
    updateTx,
    fetchingInboxTxTimestamp,
    fetchingClaimStatus,
    fetchingL2ToL1Msg,
    l2ToL1Msg,
    canClaim,
  } = useTransaction({ tx: tx, enabled: triggered });

  const transactionState = useTransactionStatus(transaction);
  useEffect(() => {
    if (!triggered && isVisible) {
      setTriggered(true);
    }
  }, [isVisible]);

  return (
    <div className="flex flex-col text-start justify-between bg-gray-100 border border-neutral-200 rounded-2xl pt-4  overflow-hidden">
      <div
        ref={ref}
        className="flex flex-col grow justify-between text-primary-700 px-4 md:px-6"
      >
        {triggered && (
          <>
            <InitiateWithdrawal transaction={transaction} />
            <ConfirmWithdrawal
              transaction={transaction}
              onError={(e) => setError(e.message)}
              fetchingInboxTxTimestamp={fetchingInboxTxTimestamp}
              updateTx={updateTx}
              state={transactionState}
            />
            <ForceStep
              transaction={transaction}
              onError={(e) => setError(e.message)}
              triggered={triggered}
              fetchingClaimStatus={fetchingClaimStatus}
              fetchingL2ToL1Msg={fetchingL2ToL1Msg}
              state={transactionState}
            />
            <ClaimStep
              transaction={transaction}
              onError={(e) => setError(e.message)}
              fetchingClaimStatus={fetchingClaimStatus}
              fetchingQueries={fetchingClaimStatus || fetchingL2ToL1Msg}
              l2ToL1Msg={l2ToL1Msg!}
              updateTx={updateTx}
              state={transactionState}
              fetchingL2ToL1Msg={fetchingL2ToL1Msg}
              canClaim={canClaim}
            />
          </>
        )}
      </div>

      <div className="bg-gray-200 mt-4 px-4 py-3 text-center">
        <div className="text-sm">
          Have questions about this process?
          <a className="link" href={LEARN_MORE_URI} target="_blank">
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
}
