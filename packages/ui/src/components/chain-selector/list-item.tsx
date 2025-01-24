import { CustomChain } from "@/types";
import { Trash2Icon } from "lucide-react";
import PencilIcon from '../../assets/pencil-icon.svg'
import ChainAvatar from "../chain-avatar";
import StarIcon from '../../assets/star-icon.svg'

interface IListItemProps {
  chain: CustomChain;
  onSelect: (chain: CustomChain) => void;
  onFeaturedClick: (chain: CustomChain) => void;
  onDeleteClick: (chain: CustomChain) => void;
  onEditClick: (chain: CustomChain) => void
}
export const ListItem = ({
  chain,
  onSelect,
  onFeaturedClick,
  onDeleteClick,
  onEditClick
}: IListItemProps) => {
  return (
    <ul
      key={chain.chainId}
      className="group w-full text-black rounded-md p-1 cursor-pointer flex items-center justify-between gap-2 pr-3"
    >
      <li
        className="flex items-center gap-3 text-base text-black"
        onClick={() => onSelect(chain)}
      >
        <ChainAvatar src={chain.logoURI} size={32} />
        {chain.name}
      </li>
      <div className="flex gap-4 items-center z-10">
        <img
          src={PencilIcon}
          onClick={() => onEditClick(chain)}
          className="w-[18px] fill-[#E4E4E7] group-hover:fill-gray-dark"
        />
        <Trash2Icon
          onClick={() => onDeleteClick(chain)}
          className="w-[18px] fill-[#E4E4E7] group-hover:fill-gray-dark"
        />
        <img
          src={StarIcon}
          onClick={() => onFeaturedClick(chain)}
          className="w-[18px] fill-[#E4E4E7] group-hover:fill-gray-dark"
        />
      </div>
    </ul>
  );
};
