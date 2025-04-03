import { TESTNET_FILTER } from "@/constants";
import { NetworkFilter } from "@/types";
import classNames from "classnames";
import React from "react";

type FilterOption = NetworkFilter;

interface NetworkFilterTabsProps {
  value: NetworkFilter;
  onChange: (value: NetworkFilter) => void;
}

const options: { label: string; value: FilterOption }[] = [
  { label: "All", value: TESTNET_FILTER.ALL },
  { label: "Mainnet", value: TESTNET_FILTER.MAINNET },
  { label: "Testnet", value: TESTNET_FILTER.TESTNET },
];

export const TestnetFilterTabs: React.FC<NetworkFilterTabsProps> = ({
  value,
  onChange,
}) => {
  return (
    <div className="w-full flex gap-0">
      {options.map((option) => {
        const isActive = value === option.value;
        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={classNames({
              "w-full text-left px-3 py-2 border-b text-base transition-all duration-300 font-normal":
                true,
              " text-gray-light": !isActive,
              "text-primary-700 border-primary-700": isActive,
            })}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
};
