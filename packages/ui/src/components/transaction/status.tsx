import { useAlertContext } from "@/contexts/alert/alert-context";
import { useWeb3ClientContext } from "@/contexts/web3-client-context";
import useArbitrumBridge, { ClaimStatus } from "@/hooks/use-arbitrum-bridge";
import useOnScreen from "@/hooks/use-on-screen";
import { Transaction, transactionsStorageService } from "@/lib/transactions";
import { getTimestampFromTxHash } from "@/lib/tx-actions";
import { useMutation, useQuery } from "@tanstack/react-query";
import cn from "classnames";
import { addDays, addHours, intervalToDuration } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Address } from "viem";
import { AddToCalendarButton } from "../add-to-calendar";
import { StatusStep } from "./status-step";
import { arbitrumScan, l1Scan, LEARN_MORE_URI } from "@/constants";
import { Countdown } from "./countdown";

//TODO: refactor this code : make it more readable and clean

export function TransactionStatus(props: {
    tx: Transaction;
    isActive: boolean;
}) {
    const {
        signer,
        forceInclude,
        isForceIncludePossible,
        getClaimStatus,
        claimFunds,
        pushChildTxToParent,
        getL2toL1Msg,
    } = useArbitrumBridge();

    const [transaction, setTransaction] = useState<Transaction>(props.tx);
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useOnScreen(ref);
    const { publicParentClient, childProvider } = useWeb3ClientContext();
    const [triggered, setTriggered] = useState(false);
    const remainingHours = transaction.delayedInboxTimestamp
        ? calculateRemainingHours(transaction.delayedInboxTimestamp)
        : undefined;
    const { setError } = useAlertContext();

    const forceIncludeTx = useMutation({
        mutationFn: forceInclude,
        onError: setError,
    });

    const confirmTx = useMutation({
        mutationFn: pushChildTxToParent,
        onError: setError,
    });

    const claimFundsTx = useMutation({
        mutationFn: claimFunds,
        onError: setError,
    });

    const { data: l2ToL1Msg, isFetching: fetchingL2ToL1Msg } = useQuery({
        queryKey: ["l2ToL1Msg", transaction.bridgeHash],
        queryFn: () =>
            getL2toL1Msg(transaction.bridgeHash, childProvider, signer!),
        enabled:
            triggered &&
            !!signer &&
            !!transaction.delayedInboxTimestamp &&
            transaction.claimStatus !== ClaimStatus.CLAIMED,
        staleTime: Infinity,
    });

    const { data: claimStatusData, isFetching: fetchingClaimStatus } = useQuery(
        {
            queryKey: ["claimStatus", transaction.bridgeHash],
            queryFn: () => getClaimStatus(childProvider, l2ToL1Msg!),
            enabled: !!l2ToL1Msg && !!childProvider && !!transaction.bridgeHash,
            staleTime: 60000,
            refetchOnMount: false,
        }
    );

    const { data: canForceInclude, isFetching: fetchingForceIncludeStatus } =
        useQuery({
            queryKey: ["forceIncludeStatus", transaction.delayedInboxHash],
            queryFn: () => isForceIncludePossible(signer!),
            enabled:
                triggered &&
                !!signer &&
                remainingHours === 0 &&
                transaction.claimStatus === ClaimStatus.PENDING,
        });

    const {
        data: delayedInboxTxTimestamp,
        isFetching: fetchingInboxTxTimestamp,
    } = useQuery({
        queryKey: ["delayedInboxTimestamp", transaction.delayedInboxHash],
        queryFn: () =>
            getTimestampFromTxHash(
                transaction.delayedInboxHash!,
                publicParentClient
            ),
        enabled:
            triggered &&
            transaction.delayedInboxHash !== undefined &&
            !transaction.delayedInboxTimestamp,
    });

    function calculateRemainingHours(timestamp: number) {
        const dueDate = addDays(timestamp, 1);
        const remainingHours = intervalToDuration({
            start: Date.now(),
            end: dueDate,
        }).hours;

        return !remainingHours || remainingHours < 0 ? 0 : remainingHours;
    }

    function updateTx(updatedTx: Transaction) {
        setTransaction(updatedTx);
        transactionsStorageService.update(updatedTx);
    }

    function onConfirm() {
        if (!signer) return;

        confirmTx.mutate(
            {
                l2SignedTx: transaction.bridgeHash,
                parentSigner: signer,
            },
            {
                onSuccess: (inboxTx) => {
                    let updatedTx = {
                        ...transaction,
                        delayedInboxHash: inboxTx.hash as Address,
                    };
                    updateTx(updatedTx);
                    inboxTx.wait().then(() =>
                        updateTx({
                            ...updatedTx,
                            delayedInboxTimestamp: Date.now(),
                        })
                    );
                },
            }
        );
    }

    function onForce() {
        if (!signer) return;

        forceIncludeTx.mutate(signer);
    }

    function onClaim() {
        if (!signer) return;

        claimFundsTx.mutate(
            {
                l2ToL1Msg,
                parentSigner: signer,
                childProvider,
            },
            {
                onSuccess: () => {
                    updateTx({
                        ...transaction,
                        claimStatus: ClaimStatus.CLAIMED,
                    });
                },
            }
        );
    }

    useEffect(() => {
        if (delayedInboxTxTimestamp)
            updateTx({
                ...transaction,
                delayedInboxTimestamp: delayedInboxTxTimestamp,
            });
    }, [delayedInboxTxTimestamp]);

    useEffect(() => {
        if (claimStatusData && claimStatusData !== ClaimStatus.PENDING)
            updateTx({ ...transaction, claimStatus: claimStatusData });
    }, [claimStatusData]);

    useEffect(() => {
        if (!triggered && isVisible) setTriggered(true);
    }, [isVisible]);

    const l2TxUrl = `${arbitrumScan}/tx/${transaction.bridgeHash}`;
    const l1TxUrl = `${l1Scan}/tx/${transaction.delayedInboxHash}`;
    
    const confirmWithdraw = !transaction.delayedInboxHash ||
    !transaction.delayedInboxTimestamp
    const canClaim = transaction.claimStatus === ClaimStatus.CLAIMABLE &&
    !fetchingClaimStatus &&
    !fetchingL2ToL1Msg
    const claimTimeRemainingActive = transaction.claimStatus === ClaimStatus.PENDING && !canClaim && !fetchingClaimStatus && !fetchingL2ToL1Msg;

    const forceStepRunning = forceIncludeTx.isPending || fetchingForceIncludeStatus || fetchingClaimStatus
    const forceStepDone = ([ClaimStatus.CLAIMED, ClaimStatus.CLAIMABLE].includes(
        transaction.claimStatus
    ) ||
        (remainingHours == 0 && !canForceInclude)) &&
    (!fetchingClaimStatus || !fetchingL2ToL1Msg)
    const forceStepActive = !forceStepDone && !!transaction.delayedInboxTimestamp &&
    transaction.claimStatus === ClaimStatus.PENDING
    
    const claimStepActive =
        transaction.claimStatus !== ClaimStatus.CLAIMED && !forceStepActive && !confirmWithdraw;
    return (
        <div className="flex flex-col text-start justify-between bg-gray-100 border border-neutral-200 rounded-2xl pt-4  overflow-hidden">
            <div
                ref={ref}
                className="flex flex-col grow justify-between text-primary-700 px-4 md:px-6"
            >
                <StatusStep
                    done
                    number={1}
                    title="Initiate Withdraw"
                    description="Your withdraw transaction in Arbitrum"
                    className="pt-2 md:flex md:space-x-4 mb-4"
                >
                    <a
                        href={l2TxUrl}
                        target="_blank"
                        className="link text-sm flex space-x-1 items-center"
                    >
                        <span>Arbitrum tx </span>
                        <ArrowUpRight className="h-3 w-3" />
                    </a>
                </StatusStep>
                <StatusStep
                    done={!!transaction.delayedInboxTimestamp}
                    active={
                        confirmWithdraw
                    }
                    running={
                        confirmTx.isPending ||
                        fetchingInboxTxTimestamp ||
                        (transaction.delayedInboxHash &&
                            !transaction.delayedInboxTimestamp)
                    }
                    number={2}
                    title="Confirm Withdraw"
                    description="Send the Arbitrum withdraw transaction through the delayed inbox"
                    className="pt-2 space-y-2 md:space-y-0 md:space-x-2 mb-4 flex items-start flex-col md:flex-row md:items-center"
                >
                    {!transaction.delayedInboxHash &&
                        !transaction.delayedInboxTimestamp &&
                        !fetchingInboxTxTimestamp && (
                            <button
                                onClick={onConfirm}
                                className={cn("btn btn-primary btn-sm", {
                                    "opacity-50": confirmTx.isPending,
                                })}
                                disabled={confirmTx.isPending}
                            >
                                Confirm
                            </button>
                        )}
                    {transaction.delayedInboxHash && (
                        <a
                            href={l1TxUrl}
                            target="_blank"
                            className="link text-sm flex space-x-1 items-center "
                        >
                            <span>Ethereum delayed inbox tx </span>
                            <ArrowUpRight className="h-3 w-3" />
                        </a>
                    )}
                </StatusStep>
                <StatusStep
                    done={
                        forceStepDone
                    }
                    active={
                        forceStepActive
                    }
                    running={
                        forceStepRunning
                    }
                    number={3}
                    title="Force transaction"
                    description="If after 24 hours your Arbitrum transaction hasn't been mined, you can push it forward manually with some extra fee in ethereum"
                    className="flex flex-col items-start pt-2 space-y-2 md:space-y-0 md:space-x-2 mb-4 md:flex-row md:items-center"
                >
                    {canForceInclude && (
                        <button
                            onClick={onForce}
                            className="btn btn-primary btn-sm"
                        >
                            Force include
                        </button>
                    )}
                    {!forceStepRunning && !canForceInclude &&
                        transaction.claimStatus === ClaimStatus.PENDING &&
                        transaction.delayedInboxTimestamp &&
                        remainingHours! > 0 && (
                            <>
                                <a className="text-sm font-semibold">
                                    ~ {remainingHours} hours remaining
                                </a>
                                <AddToCalendarButton
                                    event={{
                                        title: "Push forward your transaction",
                                        description:
                                            "Wait is over, if your transaction hasn't go through by now, you can force include it from Arbitrum connect.",
                                        startDate: addHours(
                                            transaction.delayedInboxTimestamp,
                                            24
                                        ),
                                        endDate: addHours(
                                            transaction.delayedInboxTimestamp,
                                            25
                                        ),
                                    }}
                                />
                            </>
                        )}
                </StatusStep>

                <StatusStep
                    done={transaction.claimStatus === ClaimStatus.CLAIMED}
                    active={claimStepActive}
                    running={
                        claimFundsTx.isPending ||
                        fetchingClaimStatus ||
                        fetchingL2ToL1Msg
                    }
                    number={4}
                    className="flex flex-col items-start pt-2 space-y-2 md:space-y-0 md:space-x-2 mb-4 md:flex-row md:items-center"
                    title="Claim funds on Ethereum"
                    description="After your transaction has been validated, you can track its status. Once the 7-day canonical bridge period on Arbitrum has elapsed, you will be able to claim your funds here."
                    lastStep
                >
                    {claimTimeRemainingActive && <Countdown startTimestamp={transaction.delayedInboxTimestamp} daysToAdd={7} />}
                    {canClaim && (
                            <button
                                onClick={onClaim}
                                className={cn("btn btn-primary btn-sm", {
                                    "opacity-50": claimFundsTx.isPending,
                                })}
                                disabled={claimFundsTx.isPending}
                            >
                                Claim funds{" "}
                            </button>
                        )}
                </StatusStep>
            </div>
            <div className="bg-gray-200 mt-4 px-4 py-3 text-center">
                <div className="text-sm">
                    Have questions about this process?{" "}
                    <a className="link" href={LEARN_MORE_URI} target="_blank">
                        Learn More
                    </a>
                </div>
            </div>
        </div>
    );
}
