import { useEffect, useState } from "react";
import { SearchInput } from "../sarch-input";
import { CustomChain } from "@/types";
import { useAccount } from "wagmi";
import { FILTERS } from "@/constants";
import { useCustomChain } from "@/hooks/use-custom-chain";
import { useSelectedChain } from "@/hooks/use-selected-chain";
import { AssetFilters } from "./Filters";
import { ListItem } from "./list-item";
import { redirect } from '@tanstack/react-router'
import { useNavigate } from '@tanstack/react-router';

export const ChainSelector = ({}: {}) => {
  const { address } = useAccount();
  const { chains, getUserChains } = useCustomChain();
  const { selectedChain, setSelectedChain } = useSelectedChain();
  const [filter, setFilter] = useState<FILTERS>(FILTERS.ALL);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleFiltersChange = (filter: FILTERS) => {
    setFilter(filter);
  };

  useEffect(() => {
    if (address) getUserChains(address, searchTerm, filter);
  }, [address, searchTerm, filter]);

  const handleSelectChain = (chain: CustomChain) => {
    setSelectedChain(chain);
    navigate({ to: "/" });
  };

  return (
    <section className="max-w-xl mx-auto">
      <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5">
        <h1 className="text-2xl text-black text-left">
          Selected Chain:{" "}
          <span className="font-bold">{selectedChain.name}</span>
        </h1>

        <div className="mt-8">
          <SearchInput onChange={(value) => setSearchTerm(value)} />
        </div>
        <AssetFilters onChange={handleFiltersChange} value={filter} />
        <div className="mt-11 min-h-80 max-h-80 overflow-y-scroll flex flex-col gap-6">
          {chains.map((chain) => {
            return (
              <ListItem
                key={`listItem_chain_${chain.chainId}`}
                chain={chain}
                onSelect={handleSelectChain}
                onDeleteClick={(c) => {}}
                onFeaturedClick={(c) => {}}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};
