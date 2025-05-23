import { ITxReq } from "@/lib/get-tx-price";
import {
  ChildToParentMessageStatus,
  ChildToParentMessageWriter,
  ChildTransactionReceipt,
  getArbitrumNetwork,
  InboxTools,
} from "@arbitrum/sdk";
import { ArbSys__factory } from "@arbitrum/sdk/dist/lib/abi/factories/ArbSys__factory";
import { ARB_SYS_ADDRESS } from "@arbitrum/sdk/dist/lib/dataEntities/constants";
import "@rainbow-me/rainbowkit/styles.css";
import { ethers } from "ethers";
import { Address } from "viem";
import { useAccount, useSwitchChain } from "wagmi";
import { useEthersSigner } from "./use-ethers-signer";
export enum ClaimStatus {
  PENDING = "PENDING",
  CLAIMABLE = "CLAIMABLE",
  CLAIMED = "CLAIMED",
}

export default function useArbitrumBridge(props: {
  parentChainId: number;
  childChainId: number;
}) {
  const parentChainId = props.parentChainId;
  const childChainId = props.childChainId;

  const { switchChainAsync } = useSwitchChain();
  const { address } = useAccount();
  const signer = useEthersSigner({ chainId: parentChainId });
  const childNetwork = getArbitrumNetwork(childChainId);

  async function ensureChainId(chainId: number) {
    return switchChainAsync({ chainId });
  }

  async function sendWithDelayedInbox(
    tx: ITxReq,
    childSigner: ethers.providers.JsonRpcSigner
  ) {
    if (!childChainId || !childNetwork) {
      throw new Error("No child network available");
    }
    await ensureChainId(childChainId);
    const inboxSdk = new InboxTools(signer!, childNetwork);

    // extract l2's tx hash first so we can check if this tx executed on l2 later.
    const l2Txhash = (await inboxSdk.sendChildTx(tx, childSigner)) as Address;

    return l2Txhash;
  }

  async function isForceIncludePossible(
    parentSigner: ethers.providers.JsonRpcSigner
  ) {
    if (!childNetwork || !parentChainId) {
      throw new Error("No child network available");
    }
    await ensureChainId(parentChainId);
    const inboxSdk = new InboxTools(parentSigner, childNetwork);
    const canForceInclude = await inboxSdk.getForceIncludableEvent();

    return !!canForceInclude;
  }

  async function forceInclude(parentSigner: ethers.providers.JsonRpcSigner) {
    if (!childNetwork || !parentChainId) {
      throw new Error("No child network available");
    }
    await ensureChainId(parentChainId);
    const inboxTools = new InboxTools(parentSigner, childNetwork);

    if (!(await inboxTools.getForceIncludableEvent())) {
      throw new Error("Force inclusion is not possible");
    }

    const forceInclusionTx = await inboxTools.forceInclude();

    if (forceInclusionTx) {
      return await forceInclusionTx.wait();
    } else return null;
  }

  async function assembleWithdraw(
    from: string,
    amountInWei: string
  ): Promise<ITxReq> {
    // Assemble a generic withdraw transaction
    const arbsysIface = ArbSys__factory.createInterface();
    const calldatal2 = arbsysIface.encodeFunctionData("withdrawEth", [
      from,
    ]) as Address;

    return {
      data: calldatal2,
      to: ARB_SYS_ADDRESS,
      value: BigInt(amountInWei),
    };
  }

  async function initiateWithdraw(
    amountInWei: string,
    childSigner: ethers.providers.JsonRpcSigner
  ) {
    if (!address) {
      throw new Error("No address available");
    }

    return await sendWithDelayedInbox(
      await assembleWithdraw(address, amountInWei),
      childSigner
    );
  }

  async function pushChildTxToParent(props: {
    childSignedTx: Address;
    parentSigner: ethers.providers.JsonRpcSigner;
  }) {
    if (!parentChainId || !childChainId) {
      throw new Error("No child network available");
    }
    await ensureChainId(parentChainId);
    const inboxSdk = new InboxTools(props.parentSigner, childNetwork);

    // send tx to l1 delayed inbox
    const childTx = await inboxSdk.sendChildSignedTx(props.childSignedTx);
    if (childTx == null)
      throw new Error(`Failed to send tx to l1 delayed inbox!`);

    return childTx;
  }

  async function getL2toL1Msg(
    l2TxnHash: string,
    childProvider: ethers.providers.JsonRpcProvider,
    parentSigner: ethers.providers.JsonRpcSigner
  ) {
    if (!l2TxnHash.startsWith("0x") || l2TxnHash.trim().length != 66)
      throw new Error(`Hmm, ${l2TxnHash} doesn't look like a txn hash...`);

    // First, let's find the Arbitrum txn from the txn hash provided
    const receipt = await childProvider.getTransactionReceipt(l2TxnHash);
    if (receipt === null) return receipt;

    const l2Receipt = new ChildTransactionReceipt(receipt);
    // In principle, a single transaction could trigger any number of outgoing messages; the common case will be there's only one.
    // We assume there's only one / just grad the first one.
    const messages = await l2Receipt.getChildToParentMessages(parentSigner);

    return messages[0];
  }

  async function getClaimStatus(
    childProvider: ethers.providers.JsonRpcProvider,
    l2ToL1Msg: ChildToParentMessageWriter
  ): Promise<ClaimStatus> {
    if (!l2ToL1Msg) {
      throw new Error(
        "Provide an L2 transaction that sends an L2 to L1 message or the message itself"
      );
    }

    if (!l2ToL1Msg) return ClaimStatus.PENDING;

    // Check if already executed
    if (
      (await l2ToL1Msg.status(childProvider)) ==
      ChildToParentMessageStatus.EXECUTED
    ) {
      return ClaimStatus.CLAIMED;
    }
    // block number of the first block where the message can be executed or null if it already can be executed or has been executed
    const block = await l2ToL1Msg.getFirstExecutableBlock(childProvider);
    if (block === null) {
      return ClaimStatus.CLAIMABLE;
    } else {
      return ClaimStatus.PENDING;
    }
  }

  async function claimFunds(props: {
    l2ToL1Msg?: ChildToParentMessageWriter;
    parentSigner: ethers.providers.JsonRpcSigner;
    childProvider: ethers.providers.JsonRpcProvider;
  }) {
    if (!parentChainId) {
      throw new Error("No parent network available");
    }
    await ensureChainId(parentChainId);
    if (!props.l2ToL1Msg) {
      throw new Error(
        "Provide an L2 transaction that sends an L2 to L1 message"
      );
    }

    // Check if already executed
    if (
      (await props.l2ToL1Msg.status(props.childProvider)) ==
      ChildToParentMessageStatus.EXECUTED
    ) {
      return null;
    }

    // Now that its confirmed and not executed, we can execute our message in its outbox entry.
    const res = await props.l2ToL1Msg.execute(props.childProvider);
    const rec = await res.wait();

    return rec;
  }

  return {
    isForceIncludePossible,
    forceInclude,
    initiateWithdraw,
    pushChildTxToParent,
    getClaimStatus,
    claimFunds,
    getL2toL1Msg,
    signer,
  };
}
