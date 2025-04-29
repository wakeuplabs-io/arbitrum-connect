import envParsed from '@/envParsed';
import cn from 'classnames';
import { useAccount } from 'wagmi';

interface TestnetIndicatorProps {
  classNames?: string;
}

export function TestnetIndicator(props: TestnetIndicatorProps) {
  const { isConnected } = useAccount();

  // If user is connected to a testnet
  if (envParsed().IS_TESTNET && isConnected) {
    return (
      <div className={cn('fixed bottom-5 right-5 bg-[#213147] text-white py-2 px-4 rounded-xl z-50', props.classNames)}>
        You are on a testnet
      </div>
    );
  }

  return null;
}
