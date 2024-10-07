import useArbitrumBridge from '@/hooks/useArbitrum';
import { Transaction, transactionsStorageService } from '@/lib/transactions';
import { useState } from 'react';
import TermsModal from '../layout/terms-modal';
import TransactionsActivity from './activity';
import TransactionAmount from './amount';
import TransactionResultCard from './result';
import TransactionReview from './review';

enum STEPS {
  menu,
  list,
  amount,
  review,
  result,
}

export default function TransactionScreen() {
  const [currentStep, setCurrentStep] = useState(STEPS.menu);
  const [amountInWei, setAmountInWei] = useState<string>('0');
  const [showModal, setShowModal] = useState(true);
  const [currentTx, setCurrentTx] = useState<Transaction | null>();
  const { initiateWithdraw } = useArbitrumBridge();

  const onReviewSubmit = () => {
    return initiateWithdraw(amountInWei)
      .then((x) => {
        console.log(x);

        const tx: Transaction = {
          bridgeHash: x.l2Txhash,
          delayedInboxHash: x.l1Txhash,
          amount: amountInWei,
        };
        transactionsStorageService.pushTransaction(tx);
        setCurrentTx(tx);

        setCurrentStep(STEPS.result);
      })
      .catch((e) => {
        console.error(e);
        window.alert('Something went wrong, please try again');
      });
  };

  return (
    <div className='py-10 px-4 flex-1'>
      {currentStep === STEPS.menu && (
        <div className='flex gap-2 justify-center'>
          <button className='btn' onClick={() => setCurrentStep(STEPS.amount)}>
            New Tx
          </button>
          <button className='btn' onClick={() => setCurrentStep(STEPS.list)}>
            Last Txs
          </button>
        </div>
      )}
      {currentStep === STEPS.list && (
        <TransactionsActivity
          setCurrentTx={(tx) => {
            setCurrentTx(tx);
            setCurrentStep(STEPS.result);
          }}
          onBack={() => setCurrentStep(STEPS.menu)}
        />
      )}
      {currentStep === STEPS.amount && (
        <TransactionAmount
          amountInWei={amountInWei}
          onBack={() => {
            setCurrentStep(STEPS.menu);
          }}
          onSubmit={(amount) => {
            setAmountInWei(amount);
            setCurrentStep(STEPS.review);
          }}
        />
      )}
      {currentStep === STEPS.review && (
        <TransactionReview
          amountInWei={amountInWei}
          onBack={() => {
            setCurrentStep(STEPS.amount);
          }}
          onSubmit={onReviewSubmit}
        />
      )}
      {currentStep === STEPS.result && (
        <TransactionResultCard
          tx={currentTx!}
          onGoHome={() => setCurrentStep(STEPS.menu)}
          onGoToActivity={() => setCurrentStep(STEPS.list)}
        />
      )}
      <TermsModal isOpen={showModal} onSubmit={() => setShowModal(false)} />
    </div>
  );
}
