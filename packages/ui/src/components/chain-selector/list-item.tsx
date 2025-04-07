import { CustomChain } from "@/types";
import { Trash2Icon, Star, PencilIcon } from "lucide-react";
import ChainAvatar from "../chain-avatar";

interface IListItemProps {
  chain: CustomChain;
  onSelect: (chain: CustomChain) => void;
  onDeleteClick: (chain: CustomChain) => void;
  onEditClick: (chain: CustomChain) => void;
}
export const ListItem = ({
  chain,
  onSelect,
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
            <PencilIcon
              onClick={() => onEditClick(chain)}
              className="w-[18px] fill-[#E4E4E7] group-hover:fill-gray-dark"
            />
            <Trash2Icon
              onClick={() => onDeleteClick(chain)}
              className="w-[18px] fill-[#E4E4E7] group-hover:fill-gray-dark"
            />
          </>
        )}
        {chain.featured && (
          <Star
            className="w-[18px] hover:animate-pulse"
            color={chain.featured ? "#c2be05" : "#E4E4E7"}
            fill={chain.featured ? "#ddd906" : "#E4E4E7"}
          />
        )}
      </div>
    </ul>
  );
};
