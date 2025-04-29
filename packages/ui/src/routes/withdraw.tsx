import EthIcon from "@/assets/ethereum-icon.svg";
import { LEARN_MORE_URI } from "@/constants";
import { useAlertContext } from "@/contexts/alert/alert-context";
import { useWeb3ClientContext } from "@/contexts/web3-client-context";
import { useEthPrice } from "@/hooks/use-eth-price";
import useArbitrumBridge, { ClaimStatus } from "@/hooks/use-arbitrum-bridge";
import {
  getMockedL1ClaimTxGasLimit,
  getMockedL2WithdrawPrice,
  getMockedSendL1MsgPrice,
} from "@/lib/get-tx-price";
import { Transaction, transactionsStorageService } from "@/lib/transactions";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import cn from "classnames";
import { BigNumber } from "ethers";
import { formatEther } from "ethers/lib/utils";
import { ChevronLeft, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Address } from "viem";
import { useAccount } from "wagmi";

interface SearchParams {
  amount: string;
}

export const Route = createFileRoute("/withdraw")({
  component: WithdrawScreen,
  validateSearch: (search): SearchParams => {
    try {
      if (!search.amount) throw new Error("Amount is required");
      return {
        amount:
          BigNumber.from(
            (search.amount as string).replace(/"/g, "")
          ).toString() ?? "0",
      };
    } catch (e) {
      return { amount: "0" };
    }
  },
});

function WithdrawScreen() {
  const navigate = useNavigate();
  const { address } = useAccount()
  const { parentProvider, childProvider } = useWeb3ClientContext();
  const { amount: amountInWei } = Route.useSearch();
  const { ethPrice } = useEthPrice();

  const [approvedAproxFees, setApprovedAproxFees] = useState<boolean>(false);
  const [approvedSequencerMaySpeedUp, setApprovedSequencerMaySpeedUp] =
    useState<boolean>(false);
  const [approvedTime, setApprovedTime] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);
  const { initiateWithdraw, signer } = useArbitrumBridge();
  const { setError } = useAlertContext();
  const { data: withdrawPrice, isFetching: withdrawPriceFetching } = useQuery({
    queryKey: ["withdrawPrice"],
    queryFn: () => getMockedL2WithdrawPrice(childProvider),
    refetchOnWindowFocus: true,
    initialData: BigNumber.from(0),
  });
  const { data: confirmPrice, isFetching: confirmPriceFetching } = useQuery({
    queryKey: ["confirmPrice"],
    queryFn: () => getMockedSendL1MsgPrice(parentProvider),
    refetchOnWindowFocus: true,
    initialData: BigNumber.from(0),
  });
  const { data: claimPrice, isFetching: claimPriceFetching } = useQuery({
    queryKey: ["claimPrice"],
    queryFn: () => getMockedL1ClaimTxGasLimit(parentProvider),
    refetchOnWindowFocus: true,
    initialData: BigNumber.from(0),
  });

  function onContinue(address: Address) {
    setLoading(true);
    signer &&
      initiateWithdraw(amountInWei, signer)
        .then((l2Txhash) => {
          const tx: Transaction = {
            bridgeHash: l2Txhash,
            amount: amountInWei,
            claimStatus: ClaimStatus.PENDING,
          };
          transactionsStorageService.create(tx, address);
          navigate({ to: `/activity/${tx.bridgeHash}` });
        })
        .catch((e) => {
          setError(e);
        })
        .finally(() => setLoading(false));
  }

  const canContinue = useMemo(() => {
    return approvedAproxFees && approvedSequencerMaySpeedUp && approvedTime;
  }, [approvedAproxFees, approvedSequencerMaySpeedUp, approvedTime]);

  const amountUSD = (ethPrice * +formatEther(amountInWei)).toFixed(2);
  const withdrawUSD = (+formatEther(withdrawPrice) * ethPrice).toFixed(2);
  const confirmUSD = (+formatEther(confirmPrice) * ethPrice).toFixed(2);
  const claimUSD = (+formatEther(claimPrice) * ethPrice).toFixed(2);

  useEffect(() => {
    if (BigNumber.from(amountInWei).lte(0)) {
      navigate({ to: "/" });
    }
  }, [amountInWei]);

  return (
    <div className="flex flex-col max-w-xl mx-auto gap-6 text-primary-700">
      <button
        className="flex items-center flex-row gap-3"
        onClick={() => navigate({ to: "/" })}
      >
        <ChevronLeft size={20} />
        <div className="font-semibold text-xl text-primary-700">Review and confirm</div>
      </button>

      {/* amount */}
      <div className="flex items-center justify-between bg-neutral-50 border border-neutral-200 rounded-2xl md:p-6 p-4">
        <div className="flex items-center gap-3">
          <img src={EthIcon} alt="ethereum icon" />
          <div className="flex items-end space-x-2">
            <div
              data-test-id="withdraw-amount"
              className="text-2xl md:text-4xl font-bold"
            >{`${formatEther(amountInWei).slice(0, 15)}`}</div>
            <div className="ml-0.5 font-bold">ETH</div>
          </div>
        </div>
        <div className="text-neutral-400">~ ${amountUSD} USD</div>
      </div>

      {/* summary */}
      <div className="flex grow justify-between items-center flex-col bg-neutral-50 border border-neutral-200 rounded-2xl p-4 md:p-6 gap-6">
        <div className="text-sm rounded-2xl p-4 bg-primary-100">
          You are about to withdraw funds from Arbitrum to Ethereum. This
          process requires 2 transactions and gas fees in ETH. Any doubts?{" "}
          <a href={LEARN_MORE_URI} className="link" target="_blank">
            Learn More
          </a>
        </div>

        <div className="w-full flex items-center gap-3">
          <div className="h-5 min-w-5 mt-1 flex justify-center items-center rounded-full border-2 border-gray-800">
            <span className="text-xs">1</span>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between w-full">
            <span className="block text-left">Initiate Withdrawal</span>
            <div className="flex items-center flex-row gap-2">
              {withdrawPriceFetching ? (
                <LoaderCircle
                  strokeWidth={3}
                  size={10}
                  className="animate-spin"
                />
              ) : (
                <span className="text-sm flex flex-row items-center gap-3">
                  {formatEther(withdrawPrice)?.slice(0, 10) ?? "-"} ETH
                  <span className="text-neutral-400 text-sm">
                    ~ ${withdrawUSD}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="w-full flex items-center gap-3">
          <div className="h-5 min-w-5 mt-1 flex justify-center items-center rounded-full border-2 border-gray-800">
            <span className="text-xs">2</span>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between w-full">
            <span className="block text-left">Confirm Withdrawal</span>
            <div className="flex items-center flex-row gap-2">
              {confirmPriceFetching ? (
                <LoaderCircle
                  strokeWidth={3}
                  size={10}
                  className="animate-spin"
                />
              ) : (
                <span className="text-sm flex flex-row items-center gap-3">
                  {formatEther(confirmPrice)?.slice(0, 10) ?? "-"} ETH
                  <span className="text-neutral-400 text-sm">
                    ~ ${confirmUSD}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="w-full flex items-center gap-3">
          <div className="h-5 min-w-5 mt-1 flex justify-center items-center rounded-full border-2 border-gray-800">
            <span className="text-xs">3</span>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between w-full">
            <p className="text-left">Waiting Period</p>
            <p className="text-left text-sm">~ 24 hours</p>
          </div>
        </div>

        <div className="w-full flex items-center gap-3">
          <div className="h-5 min-w-5 mt-1 flex justify-center items-center rounded-full border-2 border-gray-800">
            <span className="text-xs">4</span>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between w-full">
            <p className="text-left">Claim funds on Ethereum</p>

            <div className="flex items-center flex-row just gap-3">
              {claimPriceFetching ? (
                <LoaderCircle
                  strokeWidth={3}
                  size={10}
                  className="animate-spin"
                />
              ) : (
                <span className="text-sm flex flex-row items-center gap-3">
                  {formatEther(claimPrice)?.slice(0, 10)} ETH
                  <span className="text-neutral-400 text-sm">
                    ~ ${claimUSD}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* terms */}
      <div className="flex grow justify-between flex-col text-start bg-neutral-50 border border-neutral-200 rounded-2xl p-4 md:p-6 gap-6">
        <div className="flex gap-4 md:gap-6">
          <input
            id="terms-time"
            type="checkbox"
            className="cursor-pointer accent-primary self-start mt-1"
            checked={approvedTime}
            onChange={() => setApprovedTime((v) => !v)}
          />
          <label className="text-sm">
            I understand the entire process will take approximately 24 hours
            before I can claim my funds on Ethereum.
          </label>
        </div>
        <div className="flex gap-4 md:gap-6">
          <input
            id="terms-sequencer"
            type="checkbox"
            className="cursor-pointer accent-primary self-start mt-1"
            checked={approvedSequencerMaySpeedUp}
            onChange={() => setApprovedSequencerMaySpeedUp((v) => !v)}
          />
          <label className="text-sm">
            I understand that once the transaction is initiated, if the
            Sequencer becomes operational again the process can be completed
            before that 24-hour period.
          </label>
        </div>
        <div className="flex gap-4 md:gap-6">
          <input
            id="terms-fees"
            type="checkbox"
            className="cursor-pointer accent-primary self-start mt-1"
            checked={approvedAproxFees}
            onChange={() => setApprovedAproxFees((v) => !v)}
          />
          <label className="text-sm">
            I understand that times and network fees are approximate and may
            change.
          </label>
        </div>
      </div>

      {/* confirm */}
      <button
        type="button"
        className={cn("btn btn-primary rounded-2xl font-normal text-neutral-100 disabled:text-neutral-400 disabled:bg-neutral-200")}
        disabled={!canContinue || loading || !address}
        onClick={() => address && onContinue(address)}
      >
        {loading ? "Loading..." : "Confirm Withdrawal"}
      </button>
    </div>
  );
}
