import ArbitrumConnectIcon from '@/assets/arbitrum-connect.svg';
import CustomConnectButton from '@/components/connect-wallet';
import { Navbar } from '@/components/layout/navbar';
import { Link, useNavigate } from '@tanstack/react-router';
import { Bell, WalletIcon } from 'lucide-react';

export default function Topbar() {
  const navigate = useNavigate();

  return (
    <header className='flex justify-between items-center | sticky top-0 sm:px-8 | h-[6rem] card--blur z-10 px-4'>
      <div className='flex gap-3 items-center | w-full'>
        <div className='flex items-center gap-3 cursor-pointer' onClick={() => navigate({ to: '/' })}>
          <img src={ArbitrumConnectIcon} width={32} height={32} alt='topbar-arbitrum connect logo' />
          <span className='text-2xl text-primary-700 hidden sm:block'>
            <b>Arbitrum</b> Connect
          </span>
        </div>
        <Navbar />
        <div className='flex space-x-3 text-primary-700'>
          <Link
            to='/activity'
            className='btn btn-outline bg-white rounded-2xl hover:bg-white hover:border-gray-300 hover:text-gray-500 w-[50px] md:w-[185px]'
          >
            <Bell size={18} />
            <span className='hidden md:block'>My activity</span>
          </Link>
          <CustomConnectButton
            id='topbar-connect-wallet'
            className='btn rounded-2xl w-[185px] hover:border-gray-300 hover:bg-primary-500'
            chainStatus='icon'
            tooltip
          >
            <WalletIcon className='h-5 w-5' />
            Connect
          </CustomConnectButton>
        </div>
      </div>
    </header>
  );
}
