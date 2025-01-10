
import { AddChain } from "@/components/add-chain";
import { createFileRoute, ErrorComponent, notFound } from "@tanstack/react-router";

export const Route = createFileRoute("/chains/$id")({
  /* loader: async ({ params }) => {
    const tx = transactionsStorageService.getByBridgeHash((params.tx as Address) ?? "0x");
    if (!tx) throw notFound();
    return tx;
  }, */
  errorComponent: ErrorComponent,
  notFoundComponent: () => {
    return <p>Transaction not found</p>;
  },
  component: AddChain,
});