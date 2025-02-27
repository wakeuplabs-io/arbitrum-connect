import { useEffect, useState } from "react";
import { SearchInput } from "../sarch-input";
import { CustomChain } from "@/types";
import { useAccount } from "wagmi";
import { FILTERS as CHAIN_FILTERS } from "@/constants";
import { useCustomChain } from "@/hooks/use-custom-chain";
import { useSelectedChain } from "@/hooks/use-selected-chain";
import { ListItem } from "./list-item";
import { useNavigate } from "@tanstack/react-router";
import { AssetFilters } from "./filters";
import { useModal } from "@/contexts/modal-context";
import Button from "../button";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export const ChainSelector = ({}: {}) => {
  const { address } = useAccount();
  const { customChains, getUserChains, deleteChain, featureChain } =
    useCustomChain();
  const { selectedChain, setSelectedChain } = useSelectedChain();
  const [filter, setFilter] = useState<CHAIN_FILTERS>(CHAIN_FILTERS.ALL);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { openConnectModal } = useConnectModal();

  const handleFiltersChange = (filter: CHAIN_FILTERS) => {
    setFilter(filter);
  };

  useEffect(() => {
    if (address) getUserChains(address, searchTerm, filter);
  }, [address, searchTerm, filter]);

  const handleSelectChain = (chain: CustomChain) => {
    setSelectedChain(chain);
    navigate({ to: "/" });
  };

  const handleDeleteChain = (chain: CustomChain) => {
    openModal("Delete Chain", `Confirm action delete ${chain.name}`, () => {
      if (!address) return;
      deleteChain(address, chain.chainId);
    });
  };

  const handleFeatureChain = (chain: CustomChain) => {
    if (!address) return;
    featureChain(address, chain.chainId);
  };

  const handleEditChain = (chain: CustomChain) => {
    navigate({ to: `/chains/${chain.chainId}/edit` });
  };

  const handleAddChain = () => {
    navigate({ to: "/chains/add" });
  };

  return (
    <section className="max-w-xl mx-auto">
      <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-5">
        <h1 className="text-2xl text-black text-left flex flex-wrap">
          Selected Chain:
          <p className="font-bold sm:ml-3">{selectedChain.name}</p>
        </h1>
        <div className="mt-8 flex flex-col lg:flex-row justify-between lg:items-center gap-4">
          <div className="flex-shrink lg:flex-grow">
            <SearchInput onChange={(value) => setSearchTerm(value)} />
          </div>
          <div className="flex flex-shrink-0">
            <AssetFilters onChange={handleFiltersChange} value={filter} />
          </div>
        </div>
        <div className="mt-11 min-h-80 max-h-80 overflow-y-scroll flex flex-col gap-6">
          {address
            ? customChains.map((chain) => {
                return (
                  <ListItem
                    key={`listItem_chain_${chain.chainId}`}
                    chain={chain}
                    onSelect={handleSelectChain}
                    onDeleteClick={handleDeleteChain}
                    onFeaturedClick={handleFeatureChain}
                    onEditClick={handleEditChain}
                  />
                );
              })
            : null}
        </div>
      </div>
      <div className="w-full my-6">
        {
          <Button
            id="continue-btn"
            onClick={(e) => {
              e.preventDefault();
              if (!address && openConnectModal) openConnectModal();
              else handleAddChain();
            }}
          >
            {address ? "Add Chain" : "Connect your wallet to get started"}
          </Button>
        }
      </div>
    </section>
  );
};
