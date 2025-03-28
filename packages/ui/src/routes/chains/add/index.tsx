import { ChainForm } from "@/components/chain-form";
import { createFileRoute, ErrorComponent } from "@tanstack/react-router";

export const Route = createFileRoute("/chains/add/")({
  errorComponent: ErrorComponent,
  notFoundComponent: () => {
    return <p>Transaction not found</p>;
  },
  component: ChainForm,
});
