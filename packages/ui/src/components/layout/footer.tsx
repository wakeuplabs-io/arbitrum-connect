import { WakeupSignature } from '@/components/wakeup-signature';

export function Footer() {
  return (
    <footer className='flex justify-center items-center | sm:px-8 | h-[4rem] z-10 bg-white px-4'>
      <WakeupSignature />
    </footer>
  );
}
