//import ArbitrumIcon from "@/assets/arbitrum-icon.svg";
import { useNavigate } from "@tanstack/react-router";
import { CustomChain } from "@/types";
import { ChevronDown } from "lucide-react";
import ChainAvatar from "./chain-avatar";

export default function ChainItem({
  chain,
  selectable = true,
  header,
}: {
  chain: CustomChain;
  selectable?: boolean;
  header: string;
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (selectable) {
      navigate({ to: `/chains` });
    }
  };

  return (
    <div
      className="flex flex-row gap-3 items-start cursor-pointer"
      onClick={handleClick}
    >
      {/* <img src={chain.logoURI || ArbitrumIcon} alt="arbitrum icon" /> */}
      <ChainAvatar src={chain.logoURI} size={34} />
      <div>
        <div className="md:text-sm text-xs text-neutral-500">{header}</div>
        <div className="flex items-end gap-3">
          <div className="font-semibold text-2xl text-primary-700 hidden md:block">
            {chain?.name}
          </div>
          {selectable && <ChevronDown />}
          {/* <div className="font-semibold text-xl text-primary-700 md:hidden">
                ARB
              </div> */}
        </div>
      </div>
    </div>
  );
}
