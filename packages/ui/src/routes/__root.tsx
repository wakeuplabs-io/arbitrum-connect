import { Footer } from '@/components/layout/footer';
import Topbar from '@/components/layout/topbar';
import { TestnetIndicator } from '@/components/testnet-indicator';
import { createRootRoute, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: () => (
    <div className="flex flex-col min-h-screen overflow-y-auto bg-[url('@/assets/background.svg')] bg-cover">
      <Topbar />
      <main className='py-8 px-4 flex-1'>
        <Outlet />
      </main>
      <TestnetIndicator />
      <Footer />
      {/* <TanStackRouterDevtools /> */}
    </div>
  ),
});
