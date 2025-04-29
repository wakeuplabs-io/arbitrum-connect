
import { createFileRoute } from "@tanstack/react-router";
import { ChainSelector } from "@/components/chain-selector";

export const Route = createFileRoute("/chains/")({
  component: ChainSelector,
});