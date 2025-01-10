import { useEffect, useState } from "react";
import useDebounce from "@/hooks/use-debounce";
import { SearchIcon } from "lucide-react";
export const SearchInput = ({
    onChange,
}: {
    onChange: (value: string) => void;
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    // Simulate a search function
    const search = (query: string) => {
        onChange(query);
    };

    // Trigger search when the debounced value changes
    useEffect(() => {
        search(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    return (
        <div className="bg-white flex items-center border border-[#D9D9D9] gap-2 md:gap-4 rounded-[20px] md:rounded-[30px] py-3 px-4">
            <SearchIcon className="" />
            <input
                type="search"
                className="grow text-gray-dark text-base placeholder-gray-dark font-normal ring-0 outline-none"
                placeholder="Search by name"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
};
