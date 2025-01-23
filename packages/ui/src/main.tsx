import { createRouter, RouterProvider } from "@tanstack/react-router";
import React from "react";
import ReactDOM from "react-dom/client";

// Import the generated route tree
import { lightTheme, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ErrorAlert from "./components/error-alert";
import { AlertProvider } from "./contexts/alert/alert-provider";
import { Web3ClientProvider } from "./contexts/web3-client-context";
import "./main.css";
import { routeTree } from "./routeTree.gen";
import WagmiSetup from "./components/hocs/wagmi-provider";
import { SelectedChainProvider } from "./contexts/selected-chain";
import ConfirmModal from "./components/layout/confirm-modal";
import { ModalProvider } from "./contexts/modal-context";

// Create a new router instance
const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <SelectedChainProvider>
      <WagmiSetup>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider
            showRecentTransactions
            coolMode
            theme={lightTheme({ borderRadius: "medium" })}
          >
            <Web3ClientProvider>
              <ModalProvider>
                <AlertProvider>
                  <ErrorAlert />
                  <ConfirmModal />
                  <RouterProvider router={router} />
                </AlertProvider>
              </ModalProvider>
            </Web3ClientProvider>
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiSetup>
    </SelectedChainProvider>
  </React.StrictMode>,
);
