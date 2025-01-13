
import { AddChain } from "@/components/add-chain";
import { createFileRoute, ErrorComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/chains/$id")({
  errorComponent: ErrorComponent,
  notFoundComponent: () => {
    return <p>Transaction not found</p>;
  },
  component: AddChain,
});