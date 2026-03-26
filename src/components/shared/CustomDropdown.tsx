"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { IoChevronDown } from "react-icons/io5";

export type DropdownOption = {
  label: string;
  value: string;
};

type CustomDropdownProps = {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  ariaLabel?: string;
  containerClassName?: string;
  buttonClassName?: string;
  chevronClassName?: string;
  menuClassName?: string;
  optionClassName?: string;
  activeOptionClassName?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  onOpenChange?: (open: boolean) => void;
};

export default function CustomDropdown({
  options,
  value,
  onChange,
  placeholder,
  disabled,
  ariaLabel,
  containerClassName,
  buttonClassName,
  chevronClassName,
  menuClassName,
  optionClassName,
  activeOptionClassName,
  onFocus,
  onBlur,
  onOpenChange,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const selectedIndex = useMemo(
    () => options.findIndex((option) => option.value === value),
    [options, value],
  );

  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : null;

  const setOpenState = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  const selectByIndex = (index: number) => {
    const option = options[index];
    if (!option) {
      return;
    }
    onChange(option.value);
    setOpenState(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpenState(false);
      }
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenState(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setHighlightedIndex(-1);
      return;
    }

    const nextIndex = selectedIndex >= 0 ? selectedIndex : 0;
    setHighlightedIndex(nextIndex);
  }, [isOpen, selectedIndex]);

  useEffect(() => {
    if (!isOpen || highlightedIndex < 0) {
      return;
    }
    optionRefs.current[highlightedIndex]?.scrollIntoView({ block: "nearest" });
  }, [highlightedIndex, isOpen]);

  const hasValue = !!selectedOption;

  const handleButtonKeyDown = (
    event: React.KeyboardEvent<HTMLButtonElement>,
  ) => {
    if (disabled || options.length === 0) {
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (!isOpen) {
        setOpenState(true);
        return;
      }
      setHighlightedIndex((idx) =>
        idx < 0 ? 0 : Math.min(idx + 1, options.length - 1),
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (!isOpen) {
        setOpenState(true);
        return;
      }
      setHighlightedIndex((idx) =>
        idx < 0 ? options.length - 1 : Math.max(idx - 1, 0),
      );
      return;
    }

    if (event.key === "Home" && isOpen) {
      event.preventDefault();
      setHighlightedIndex(0);
      return;
    }

    if (event.key === "End" && isOpen) {
      event.preventDefault();
      setHighlightedIndex(options.length - 1);
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!isOpen) {
        setOpenState(true);
        return;
      }
      const indexToSelect = highlightedIndex >= 0 ? highlightedIndex : 0;
      selectByIndex(indexToSelect);
      return;
    }

    if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      setOpenState(false);
    }
  };

  return (
    <div ref={containerRef} className={containerClassName ?? "relative"}>
      <button
        type="button"
        onClick={() => {
          if (disabled) {
            return;
          }
          setOpenState(!isOpen);
        }}
        onKeyDown={handleButtonKeyDown}
        onFocus={onFocus}
        onBlur={onBlur}
        className={
          buttonClassName ??
          "w-full min-h-11 rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm text-left text-[#1A1A2E] outline-none hover:border-[#17409A]/40 focus:border-[#17409A] transition-colors flex items-center justify-between"
        }
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        disabled={disabled}
      >
        <span className={`font-semibold ${hasValue ? "" : "text-[#9CA3AF]"}`}>
          {selectedOption?.label ?? placeholder ?? "Chọn"}
        </span>
        <IoChevronDown
          className={`${chevronClassName ?? "text-base text-[#6B7280] transition-transform"} ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && options.length > 0 && (
        <div
          role="listbox"
          className={
            menuClassName ??
            "absolute z-20 mt-2 w-full rounded-2xl border border-[#E5E7EB] bg-white shadow-xl py-1"
          }
        >
          {options.map((option, index) => {
            const isActive = selectedOption?.value === option.value;
            const isHighlighted = highlightedIndex === index;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isActive}
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => selectByIndex(index)}
                className={
                  isActive && activeOptionClassName
                    ? activeOptionClassName
                    : optionClassName
                      ? optionClassName
                      : `w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          isActive
                            ? "bg-[#17409A]/10 text-[#17409A] font-bold"
                            : isHighlighted
                              ? "bg-[#F4F7FF] text-[#1A1A2E]"
                              : "text-[#4B5563] hover:bg-[#F4F7FF]"
                        }`
                }
              >
                {option.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
