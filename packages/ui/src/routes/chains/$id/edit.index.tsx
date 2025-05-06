import { ChainForm } from "@/components/chain-form";
import CustomChainService from "@/services/custom-chain-service";
import { CustomChain } from "@/types";
import {
  createFileRoute,
  ErrorComponent,
  useLoaderData,
} from "@tanstack/react-router";

const EditChain = () => {
  const { chain } = useLoaderData({ from: "/chains/$id/edit/" });

  return <ChainForm chain={chain as CustomChain} editing />;
};

export const Route = createFileRoute("/chains/$id/edit/")({
  errorComponent: ErrorComponent,
  notFoundComponent: () => {
    return <p>Transaction not found</p>;
  },
  loader: async ({ params }) => {
    const { id } = params;
    const lastAddress = localStorage.getItem(
      "last-wallet-address"
    ) as `0x${string}`;
    if (!lastAddress) throw new Error("Connect your wallet first :)");
    const chain = await CustomChainService.getChainById(
      Number(id),
      lastAddress
    );

    if (!chain) throw new Error("Chain doesn't exist");
    if (!chain.isCustom) throw new Error("Chain is not custom");

    return { chain };
  },
  component: EditChain,
});
