"use client";

import {
  ChangeEventHandler,
  HTMLAttributes,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlassIcon,
  ChevronDownIcon,
  TagIcon,
} from "@heroicons/react/24/outline";

interface IAutoComplete {
  categories?: string[];
  labelCategory?: string;
  label?: string;
  placeholder?: string;
  isHiddenCategory?: boolean;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
  styles?: HTMLAttributes<HTMLDivElement>;
}

const AutoCompleteSearch = (props: IAutoComplete) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchValue, setSearchValue] = useState(props.value || "");
  const [isFocused, setIsFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node) &&
      buttonRef.current &&
      !buttonRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  const handleSearch = (el: any) => {
    el.preventDefault();
    if (searchValue.trim()) {
      const currentUrl = new URL(window.location.href);
      const isOnProductPage = currentUrl.pathname === "/product";

      const params = new URLSearchParams(currentUrl.search);
      params.set("search", searchValue.trim());

      if (isOnProductPage) {
        router.replace(`/product?${params.toString()}`);
      } else {
        router.push(`/product?${params.toString()}`);
      }
    }
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setSearchValue(event.target.value);
    props.onChange?.(event);
  };

  const handleClickCate = (val: string) => {
    const currentUrl = new URL(window.location.href);
    const isOnProductPage = currentUrl.pathname === "/product";

    const params = new URLSearchParams(currentUrl.search);
    params.set("sheetName", val.trim());

    if (isOnProductPage) {
      router.replace(`/product?${params.toString()}`);
    } else {
      router.push(`/product?${params.toString()}`);
    }
    setShowDropdown(false);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="py-2 px-2" style={props.styles}>
      <form onSubmit={handleSearch} className="flex relative">
        {/* Category Dropdown Button */}
        {!props.isHiddenCategory && (
          <>
            <button
              ref={buttonRef}
              id="dropdown-button"
              className={`
                flex-shrink-0 z-10
                inline-flex items-center gap-2
                py-3 px-4
                text-sm font-medium
                text-secondary-700 dark:text-secondary-300
                bg-secondary-100 dark:bg-secondary-800
                border-2 border-r-0
                ${
                  isFocused
                    ? "border-primary-500 dark:border-primary-500"
                    : "border-secondary-200 dark:border-secondary-700"
                }
                rounded-l-xl
                hover:bg-secondary-200 dark:hover:bg-secondary-700
                transition-all duration-200
              `}
              type="button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <TagIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Danh mục</span>
              <ChevronDownIcon
                className={`w-4 h-4 transition-transform duration-200 ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Category Dropdown Menu */}
            {showDropdown && (
              <div
                id="dropdown"
                ref={dropdownRef}
                className="absolute top-full left-0 mt-2 z-[1000] w-full max-w-md bg-white dark:bg-secondary-800 rounded-xl border border-secondary-200 dark:border-secondary-700 shadow-card-lg overflow-hidden animate-scale-in"
              >
                <div className="p-3">
                  <p className="text-xs font-semibold text-secondary-500 dark:text-secondary-400 uppercase tracking-wider mb-3 px-2">
                    Chọn danh mục
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {props.categories?.map((item, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleClickCate(item)}
                        className="px-3 py-2 text-sm font-medium text-secondary-700 dark:text-secondary-300 bg-secondary-100 dark:bg-secondary-700 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-all"
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Search Input Container */}
        <div className="relative w-full">
          <input
            type="search"
            id="search-dropdown"
            className={`
              block w-full
              py-3 px-4
              ${props.isHiddenCategory ? "rounded-xl" : "rounded-r-xl rounded-l-none"}
              text-sm
              text-secondary-900 dark:text-white
              bg-white dark:bg-secondary-800
              border-2
              ${
                isFocused
                  ? "border-primary-500 dark:border-primary-500 ring-4 ring-primary-500/20"
                  : "border-secondary-200 dark:border-secondary-700"
              }
              ${!props.isHiddenCategory ? "border-l-0" : ""}
              placeholder:text-secondary-400 dark:placeholder:text-secondary-500
              focus:outline-none
              transition-all duration-200
              pr-12
            `}
            placeholder={props.placeholder || "Tìm kiếm sản phẩm..."}
            value={searchValue}
            onChange={handleInputChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />

          {/* Search Button */}
          <button
            onClick={handleSearch}
            type="submit"
            className={`
              absolute top-1/2 -translate-y-1/2 right-1.5
              p-2.5
              rounded-lg
              text-white
              bg-gradient-to-r from-primary-500 to-primary-600
              hover:from-primary-600 hover:to-primary-700
              shadow-primary-sm hover:shadow-primary
              transition-all duration-200
              hover:scale-105
              active:scale-95
            `}
          >
            <MagnifyingGlassIcon className="w-4 h-4" />
            <span className="sr-only">Tìm kiếm</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AutoCompleteSearch;
