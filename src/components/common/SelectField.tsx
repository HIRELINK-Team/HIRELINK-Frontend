import { useEffect, useRef } from "react";

export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectFieldProps<T extends string> {
  value: T;
  options: SelectOption<T>[];
  placeholder: string;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onChange: (value: T) => void;
  ariaLabel: string;
  variant?: "default" | "compact";
  truncateText?: boolean;
}

function SelectField<T extends string>({
  value,
  options,
  placeholder,
  isOpen,
  onOpenChange,
  onChange,
  ariaLabel,
  variant = "default",
  truncateText = false,
}: SelectFieldProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [isOpen, onOpenChange]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => onOpenChange(!isOpen)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            onOpenChange(false);
          }
          if (event.key === "ArrowDown") {
            event.preventDefault();
            onOpenChange(true);
          }
        }}
        className={`flex w-full cursor-pointer items-center justify-between border bg-white px-4 text-left text-base transition-colors ${
          variant === "compact" ? "h-12 rounded-xl" : "h-[58px] rounded-[10px]"
        } ${
          isOpen
            ? "border-[#00b894] ring-2 ring-[#00b894]/10"
            : "border-[rgba(112,115,124,0.22)] hover:border-[#aeb4bc]"
        }`}
      >
        <span
          className={`${truncateText ? "min-w-0 flex-1 truncate" : ""} ${
            selectedOption ? "text-[#171719]" : "text-[#8b95a1]"
          }`}
        >
          {selectedOption?.label ?? placeholder}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={`ml-2 size-5 shrink-0 text-[#8b95a1] transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
        >
          <path
            d="m8 10 4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label={ariaLabel}
          className={`absolute right-0 left-0 z-30 overflow-hidden border border-[rgba(112,115,124,0.22)] bg-white shadow-[0_4px_12px_rgba(23,23,25,0.12)] ${
            variant === "compact"
              ? "top-[52px] rounded-xl p-1"
              : "top-[62px] rounded-[10px] p-2"
          }`}
        >
          {options.map((option) => (
            <button
              type="button"
              role="option"
              aria-selected={option.value === value}
              key={option.value}
              onClick={() => {
                onChange(option.value);
                onOpenChange(false);
              }}
              className={`flex w-full cursor-pointer items-center rounded-lg px-3 text-left transition-colors ${
                variant === "compact" ? "h-11 text-base" : "min-h-10 text-sm"
              } ${
                option.value === value
                  ? "bg-[#e7f8f4] font-semibold text-[#007a63]"
                  : "text-[#44464b] hover:bg-[#f7f7f8]"
              }`}
            >
              <span className={truncateText ? "min-w-0 flex-1 truncate" : ""}>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SelectField;
