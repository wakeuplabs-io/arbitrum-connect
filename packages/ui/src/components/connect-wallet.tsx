import { useUser } from "@/hooks/use-user";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import cn from "classnames";
import { ConnectButtonProps } from "node_modules/@rainbow-me/rainbowkit/dist/components/ConnectButton/ConnectButton";
import ChainAvatar from "./chain-avatar";

interface ICustomConnectButton
  extends React.ComponentProps<"button">,
    ConnectButtonProps {
  tooltip?: boolean;
}
export default function CustomConnectButton({
  chainStatus,
  tooltip,
  children,
  ...btnProps
}: ICustomConnectButton) {
  useUser();
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            className={cn({
              "btn-primary": !connected,
              "opacity-0 pointer-events-none select-none": !ready,
            })}
            aria-hidden={!ready}
          >
            {!connected ? (
              <button onClick={openConnectModal} type="button" {...btnProps}>
                {children ?? "Connect Wallet"}
              </button>
            ) : chain.unsupported ? (
              <button onClick={openChainModal} type="button" {...btnProps}>
                Wrong network
              </button>
            ) : (
              <div
                className={cn("flex items-center justify-evenly bg-white", {
                  "tooltip tooltip-bottom": tooltip,
                })}
                data-tip={chain.name}
              >
                <button onClick={openAccountModal} type="button" {...btnProps}>
                  {chainStatus === "icon" && chain.hasIcon && (
                    <ChainAvatar
                      src={chain.iconUrl}
                      size={20}
                      alt={chain.name}
                    />
                  )}
                  {account.displayName}
                </button>
              </div>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
}
