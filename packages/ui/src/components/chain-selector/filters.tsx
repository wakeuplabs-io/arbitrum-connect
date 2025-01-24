import { FILTERS, FILTERS_ARRAY } from "@/constants";
import classNames from "classnames";

export const AssetFilters = ({
  value,
  onChange,
}: {
  value: FILTERS;
  onChange: (value: FILTERS) => void;
}) => {
  return (
    <div className="w-full flex justify-start flex-nowrap gap-2">
      {FILTERS_ARRAY.map((filter) => {
        const isActive = value === filter;
        const classes = classNames(
          "min-w-[80px] p-2 text-center rounded-xl flex items-center justify-center cursor-pointer border-0 text-sm md:text-base leading-none transition-colors duration-300",
          {
            "text-white bg-black": isActive,
            "text-black neutral-100": !isActive,
          },
        );
        return (
          <div
            key={filter}
            className={classes}
            onClick={() => onChange(filter)}
          >
            {filter}
          </div>
        );
      })}
    </div>
  );
};
