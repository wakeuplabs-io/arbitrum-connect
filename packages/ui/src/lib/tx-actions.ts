import { Address, PublicClient } from "viem";

export async function getTimestampFromTxHash(
  txHash: Address,
  client: PublicClient
) {
  const blockTimestamp = await client
    .getTransaction({ hash: txHash })
    .then((tx) =>
      client
        .getBlock({ blockNumber: tx.blockNumber })
        .then((x) => Number(x.timestamp) * 1000)
    );

  return blockTimestamp;
}
