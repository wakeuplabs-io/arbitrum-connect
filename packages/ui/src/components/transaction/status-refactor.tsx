import { useEffect, useRef, useState } from "react";
import { Transaction } from "@/lib/transactions";

// Hooks
import { useAlertContext } from "@/contexts/alert/alert-context";
import useOnScreen from "@/hooks/use-on-screen";
import { LEARN_MORE_URI } from "@/constants";
import { useTransaction } from "./useGetTx";

// Steps
import InitiateWithdrawal from "./steps/initiateWithdrawal";
import ConfirmWithdrawal from "./steps/confirmWithdrawal";
import ClaimStep from "./steps/claim";
import ForceStep from "./steps/force";

export function TransactionStatus(props: {
  tx: Transaction;
  isActive: boolean;
}) {
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
    l2ToL1Msg
  } = useTransaction({ tx: props.tx, enabled: triggered });

  useEffect(() => {
    if (!triggered && isVisible) setTriggered(true);
  }, [isVisible]);

  return (
    <div className="flex flex-col text-start justify-between bg-gray-100 border border-neutral-200 rounded-2xl pt-4  overflow-hidden">
      <div
        ref={ref}
        className="flex flex-col grow justify-between text-primary-700 px-4 md:px-6"
      >
        <InitiateWithdrawal transaction={transaction} />
        <ConfirmWithdrawal
          transaction={transaction}
          onError={(e) => setError(e.message)}
          fetchingInboxTxTimestamp={fetchingInboxTxTimestamp}
          updateTx={updateTx}
        />
        <ForceStep
          transaction={transaction}
          onError={(e) => setError(e.message)}
          triggered={triggered}
          fetchingClaimStatus={fetchingClaimStatus}
          fetchingL2ToL1Msg={fetchingL2ToL1Msg}
        />
        <ClaimStep
          transaction={transaction}
          onError={(e) => setError(e.message)}
          fetchingClaimStatus={fetchingClaimStatus}
          fetchingQueries={fetchingClaimStatus || fetchingL2ToL1Msg}
          forceStepActive={!!transaction.delayedInboxHash}
          canClaim={!!transaction.delayedInboxHash}
          l2ToL1Msg={l2ToL1Msg!}
          updateTx={updateTx}
        />
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
