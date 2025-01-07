import { CustomChainContext } from "@/contexts/custom-chain";
import { useContext } from "react";

export function useCustomChainContext() {
  const context = useContext(CustomChainContext);
  if (!context) {
    throw new Error("useCustomChainContext must be used within a CustomChainProvider");
  }
  return context;
}