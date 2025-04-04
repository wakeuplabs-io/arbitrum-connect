import HomeButton from "@/components/layout/home-button";
import { TransactionStatus } from "@/components/transaction/status-refactor";
import { useGetTransactionChains } from "@/hooks/queries/useGetTransactionChains";
import { TransactionsStorageService } from "@/lib/transactions";
import {
  ErrorComponent,
  createFileRoute,
  notFound,
  useNavigate,
} from "@tanstack/react-router";
import cn from "classnames";
import { Bell, CircleCheck } from "lucide-react";
import { Address, formatEther } from "viem";

export const Route = createFileRoute("/activity/$tx")({
  loader: async ({ params }) => {
    const tx = await TransactionsStorageService.getByBridgeHash(
      (params.tx as Address) ?? "0x"
    );
    if (!tx) throw notFound();
    return tx;
  },
  errorComponent: ErrorComponent,
  notFoundComponent: () => {
    return <p>Transaction not found</p>;
  },
  component: PostComponent,
});

// Skeleton component for loading state
const TransactionSkeleton = () => (
  <div className="flex flex-col gap-6 max-w-xl mx-auto animate-pulse">
    <div className="flex flex-col items-center">
      <div className="w-12 h-12 bg-neutral-100 rounded-full mb-4" />{" "}
      {/* Circle icon */}
      <div className="w-48 h-8 bg-neutral-100 rounded-md mb-6" /> {/* Title */}
      <div className="w-full max-w-md flex flex-col gap-2">
        <div className="w-full h-5 bg-neutral-100 rounded-md" />{" "}
        {/* Text line 1 */}
        <div className="w-full h-5 bg-neutral-100 rounded-md" />{" "}
        {/* Text line 2 */}
      </div>
    </div>

    {/* Skeleton for transaction status */}
    <div className="w-full h-48 bg-neutral-100 rounded-lg" />

    {/* Skeleton for button */}
    <div className="w-full h-12 bg-neutral-100 rounded-lg" />

    {/* Skeleton for home button */}
    <div className="w-full h-12 bg-neutral-100 rounded-lg" />
  </div>
);

function PostComponent() {
  const tx = Route.useLoaderData();
  const navigate = useNavigate();
  const { parentChain, childChain, isLoading } = useGetTransactionChains(tx);

  //todo: de ejemplo esta url: https://staging-arbitrumconnect.wakeuplabs.link/activity/0x2964c4010b0c1971f6e1e2d02712334897352e35e5d043c52cef1c9b6dc4047d hacer redirect a /activity

  // Show skeleton while loading
  if (isLoading) {
    return <TransactionSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto">
      <div className="flex flex-col items-center">
        <CircleCheck size={48} color="#22C55E" />
        <div className="text-4xl font-semibold mb-6">Hey! Great Job!</div>
        <div className="md:text-xl">
          Your withdrawal request for{" "}
          <b className="font-semibold">
            {formatEther(BigInt(tx.amount))}{" "}
            {parentChain?.nativeCurrency?.symbol || "ETH"}{" "}
          </b>
          from <b className="font-semibold">{childChain?.name || "Chain"}</b> to{" "}
          <b className="font-semibold">{parentChain?.name || "Chain"}</b> has
          been successfully initiated
        </div>
      </div>

      {/* Steps */}
      <TransactionStatus tx={tx} />
      <button
        type="button"
        className={cn("btn btn-primary")}
        style={{
          border: "1px solid black",
          borderRadius: 16,
        }}
        onClick={() => navigate({ to: "/activity" })}
      >
        <Bell />
        Go to my activity
      </button>
      <HomeButton />
    </div>
  );
}
