import { CustomChain } from "@/types";
import { Trash2Icon, Star } from "lucide-react";
import PencilIcon from "../../assets/pencil-icon.svg";
import ChainAvatar from "../chain-avatar";

interface IListItemProps {
  chain: CustomChain;
  onSelect: (chain: CustomChain) => void;
  onFeaturedClick: (chain: CustomChain) => void;
  onDeleteClick: (chain: CustomChain) => void;
  onEditClick: (chain: CustomChain) => void;
}
export const ListItem = ({
  chain,
  onSelect,
  onFeaturedClick,
  onDeleteClick,
  onEditClick,
}: IListItemProps) => {
  return (
    <ul
      key={chain.chainId}
      className="group w-full text-black rounded-md p-1 cursor-pointer flex items-center justify-between gap-2 pr-3 hover:font-semibold hover:stroke-black"
    >
      <li
        className="flex items-center gap-3 text-base text-black"
        onClick={() => onSelect(chain)}
      >
        <ChainAvatar src={chain.logoURI} size={32} />
        {chain.name}
      </li>
      <div className="flex gap-4 items-center z-10">
        {chain.isCustom && (
          <>
            <img
              src={PencilIcon}
              onClick={() => onEditClick(chain)}
              className="w-[18px] fill-[#E4E4E7] group-hover:fill-gray-dark"
            />
            <Trash2Icon
              onClick={() => onDeleteClick(chain)}
              className="w-[18px] fill-[#E4E4E7] group-hover:fill-gray-dark"
            />
          </>
        )}
        <Star
          // TODO: aca se setean las favoritas...
          onClick={() => onFeaturedClick(chain)}
          className={`w-[18px] stroke-gray-icon hover:animate-pulse ${chain.featured ? "fill-gray-icon hover:fill-none" : "fill-none hover:fill-gray-icon"}`}
        />
      </div>
    </ul>
  );
};
