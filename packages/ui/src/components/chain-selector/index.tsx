import { useEffect, useState } from "react";
import { SearchInput } from "../sarch-input";
import { CustomChain, NetworkFilter } from "@/types";
import { useAccount } from "wagmi";
import { FILTERS as CHAIN_FILTERS, TESTNET_FILTER } from "@/constants";
import { useCustomChain } from "@/hooks/use-custom-chain";
import { useSelectedChain } from "@/hooks/use-selected-chain";
import { ListItem } from "./list-item";
import { useNavigate } from "@tanstack/react-router";
import { AssetFilters } from "./filters";
import { useModal } from "@/contexts/modal-context";
import Button from "../button";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { SkeletonList } from "./loading";
import { TestnetFilterTabs } from "./testnet-filter";
import { useApiClient } from "@/hooks/use-api-client";

export const ChainSelector = () => {
  const { address } = useAccount();
  const {
    customChains,
    publicChains,
    getFilteredUserChains,
    getFilteredPublicChains,
    deleteChain,
    loading,
  } = useCustomChain();
  const client = useApiClient();

  const { selectedChain, setSelectedChain } = useSelectedChain();
  const [filter, setFilter] = useState<CHAIN_FILTERS>(CHAIN_FILTERS.ALL);
  const [testnetFilter, setTestnetFilter] = useState<NetworkFilter>(
    TESTNET_FILTER.ALL
  );
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const { openModal } = useModal();
  const { openConnectModal } = useConnectModal();

  const handleFiltersChange = (filter: CHAIN_FILTERS) => {
    setFilter(filter);
  };

  const handleTestnetFilterChange = (testnetFilter: NetworkFilter) => {
    setTestnetFilter(testnetFilter);
  };

  useEffect(() => {
    if (address) {
      getFilteredUserChains(searchTerm, filter, testnetFilter);
    } else {
      getFilteredPublicChains(searchTerm, filter, testnetFilter);
    }
  }, [address, searchTerm, filter, testnetFilter]);

  const handleSelectChain = (chain: CustomChain) => {
    setSelectedChain(chain);
    navigate({ to: "/" });
  };

  const handleDeleteChain = (chain: CustomChain) => {
    openModal("Delete Chain", `Confirm action delete ${chain.name}`, () => {
      if (!address) return;
      deleteChain(client, chain.chainId);
    });
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
        <div className="mt-6">
          <TestnetFilterTabs
            onChange={handleTestnetFilterChange}
            value={testnetFilter}
          />
        </div>

        <div className="mt-6 flex flex-col lg:flex-row justify-between lg:items-center gap-4">
          <div className="flex-shrink lg:flex-grow">
            <SearchInput onChange={(value) => setSearchTerm(value)} />
          </div>
          <div className="flex flex-shrink-0">
            <AssetFilters onChange={handleFiltersChange} value={filter} />
          </div>
        </div>
        <div className="mt-11 min-h-80 max-h-80 overflow-y-scroll flex flex-col gap-6">
          {loading ? (
            <SkeletonList count={5} />
          ) : address ? (
            customChains
              .filter(
                (chain, index, self) =>
                  self.findIndex((c) => c.chainId === chain.chainId) === index
              )
              .map((chain) => {
                return (
                  <ListItem
                    key={`listItem_chain_${chain.chainId}`}
                    chain={chain}
                    onSelect={handleSelectChain}
                    onDeleteClick={handleDeleteChain}
                    onEditClick={handleEditChain}
                  />
                );
              })
          ) : (
            publicChains
              .filter(
                (chain, index, self) =>
                  self.findIndex((c) => c.chainId === chain.chainId) === index
              )
              .map((chain) => {
                return (
                  <ListItem
                    key={`listItem_chain_${chain.chainId}`}
                    chain={chain}
                    onSelect={handleSelectChain}
                    onDeleteClick={() => {}}
                    onEditClick={() => {}}
                  />
                );
              })
          )}
        </div>
      </div>
      <div className="w-full my-6 flex gap-1">
        <div className="w-14">
          <Button
            position="left"
            className="bg-primary-600 hover:bg-primary-500 flex items-center justify-center"
            onClick={() => navigate({ to: "/" })}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 8H3M3 8L8 3M3 8L8 13"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        </div>
        <div className="flex-grow">
          <Button
            id="continue-btn"
            position="right"
            onClick={(e) => {
              e.preventDefault();
              if (!address && openConnectModal) openConnectModal();
              else handleAddChain();
            }}
          >
            {address ? "Add Chain" : "Connect your wallet to get started"}
          </Button>
        </div>
      </div>
    </section>
  );
};
