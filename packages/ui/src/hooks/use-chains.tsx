import { ChainsContext } from "@/contexts/chains-context";
import { useContext } from "react";

export function useChains() {
  const context = useContext(ChainsContext);

  if (!context) {
    throw new Error("useChains must be used within a ChainsProvider");
  }
  return context;
}
