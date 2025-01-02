import { Step, StepState, TransactionState } from "@/constants";

const stepStatus = (
  transactionState: TransactionState
) => {
  return {
    [Step.INITIATE_WITHDRAWAL]: {
      [StepState.ACTIVE]: false,
      [StepState.DONE]: true,
    },
    [Step.CONFIRM_WITHDRAWAL]: {
      [StepState.ACTIVE]: transactionState === TransactionState.INITIATED,
      [StepState.DONE]: transactionState !== TransactionState.INITIATED,
    },
    [Step.FORCE_WITHDRAWAL]: {
      [StepState.ACTIVE]:
        transactionState === TransactionState.CONFIRMED ||
        transactionState === TransactionState.FORCEABLE,
      [StepState.DONE]:
        transactionState === TransactionState.CLAIMABLE ||
        transactionState === TransactionState.COMPLETED,
    },
    [Step.CLAIM]: {
      [StepState.ACTIVE]: transactionState === TransactionState.CLAIMABLE,
      [StepState.DONE]: transactionState === TransactionState.COMPLETED,
    },
  };
};
export const useStepStatus = (
  step: Step,
  transactionState: TransactionState,
) => {
  const stepStatuses = stepStatus(transactionState)[step];
  console.log( {step, transactionState, stepStatuses });
  return stepStatuses;
};
