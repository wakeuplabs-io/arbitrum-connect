import { CustomChain } from "@/types";
import { StarIcon, Trash2Icon } from "lucide-react";
import Avatar from "../Avatar";
interface IListItemProps {
  chain: CustomChain;
  onSelect: (chain: CustomChain) => void;
  onFeaturedClick: (chain: CustomChain) => void;
  onDeleteClick: (chain: CustomChain) => void;
}
export const ListItem = ({
  chain,
  onSelect,
  onFeaturedClick,
  onDeleteClick,
}: IListItemProps) => {
  return (
    <ul
      onClick={() => onSelect(chain)}
      key={chain.chainId}
      className="group w-full text-black rounded-md p-1 cursor-pointer flex items-center justify-between gap-2 pr-3"
    >
      <li className="flex items-center gap-4 text-lg text-black">
        <Avatar src={chain.logoURI} size={34} />
        {chain.name}
      </li>
      <div className="flex gap-4 items-center">
        <Trash2Icon onClick={() => onDeleteClick(chain)} />
        <StarIcon
          onClick={() => onFeaturedClick(chain)}
          className="w-5 fill-[#E4E4E7] group-hover:fill-gray-dark"
        />
      </div>
    </ul>
  );
};
