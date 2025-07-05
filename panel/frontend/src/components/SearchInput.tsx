import ButtonWithIcon from "@@/ButtonWithIcon";
import { Input } from "@@/ui/input";
import { SearchIcon, XIcon } from "lucide-react";
import { ChangeEvent, useState } from "react";

type SearchInputProps = {
  placeholder?: string;
  collapsed?: boolean;
  onChange?: (value: string) => void;
  onClear?: () => void;
};

function SearchInput({
  placeholder,
  collapsed = false,
  onChange,
  onClear,
}: SearchInputProps) {
  const [searchValue, setSearchValue] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState<boolean>(collapsed);

  function handleSearchInputChange(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    setSearchValue(value);
    if (onChange) onChange(value);
  }

  function toggleCollapsed() {
    setIsCollapsed(!isCollapsed);
  }

  function clearInput() {
    setSearchValue("");
    if (onClear) onClear();
    toggleCollapsed();
  }

  return (
    <div className="relative">
      {isCollapsed ? (
        <ButtonWithIcon
          variant="outline"
          onClick={toggleCollapsed}
          disableTooltip={true}
          icon={SearchIcon}
        />
      ) : (
        <div>
          <Input
            type="text"
            placeholder={placeholder}
            value={searchValue}
            onChange={handleSearchInputChange}
            onBlur={() => {
              if (!searchValue) toggleCollapsed();
            }}
            // autoFocus
            className="pl-10 pr-10 h-9"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="text-muted-foreground" />
          </div>

          {searchValue && (
            <button
              type="button"
              onClick={clearInput}
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              tabIndex={-1}
            >
              <XIcon />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

SearchInput.displayName = "SearchInput";
export default SearchInput;
