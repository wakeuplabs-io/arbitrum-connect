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
    l2ToL1Msg
  } = useTransaction({ tx: tx, enabled: triggered });

  const transactionState = useTransactionStatus(transaction);
  useEffect(() => {
    if (!triggered && isVisible) setTriggered(true);
  }, [isVisible]);

  // Calcular estados del step
  const steps = [
    {
      component: InitiateWithdrawal,
      state:
        transactionState
    },
    {
      component: ConfirmWithdrawal,
      state:
        transactionState
    },
    {
      component: ForceStep,
      state:
        transactionState
    },
    {
      component: ClaimStep,
      state:
        transactionState
    },
  ];

  return (
    <div>
      {steps.map((step, index) => {
        const StepComponent = step.component;
        return (
          <StepComponent
            key={index}
            transaction={transaction}
            state={step.state}
          />
        );
      })}
    </div>
  );
}
