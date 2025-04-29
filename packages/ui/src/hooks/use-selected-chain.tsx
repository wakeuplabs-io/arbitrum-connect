import { SelectedChainContext } from "@/contexts/selected-chain";
import { useContext } from "react";

export function useSelectedChain() {
  const context = useContext(SelectedChainContext);

  if (!context) {
    throw new Error("useSelectedChain must be used within a CustomChainProvider");
  }
  return context;
}