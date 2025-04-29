import { ChainForm } from "@/components/chain-form";
import CustomChainService from "@/services/custom-chain-service";
import {
  createFileRoute,
  ErrorComponent,
  useLoaderData,
} from "@tanstack/react-router";

const EditChain = () => {
  const { chain } = useLoaderData({ from: "/chains/$id/edit/" }); // Especifica el tipo aquí

  return <ChainForm chain={chain} editing />;
};

export const Route = createFileRoute("/chains/$id/edit/")({
  errorComponent: ErrorComponent,
  notFoundComponent: () => {
    return <p>Transaction not found</p>;
  },
  loader: async ({ params }) => {
    const { id } = params;
    const chain = await CustomChainService.getChainById(Number(id));
    return { chain };
  },
  component: EditChain,
});
