"use client";

import { useState, useRef, useEffect } from "react";
import type { ElementType } from "react";
import { IoChevronDown } from "react-icons/io5";

export function FormField({
  icon: Icon,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  error,
}: {
  icon: ElementType;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative group">
      <label
        className="block text-xs font-bold mb-1.5 transition-colors duration-200"
        style={{ color: focused ? "#17409A" : "#6B7280" }}
      >
        {label}
        {required && (
          <span className="ml-1" style={{ color: "#FF6B9D" }}>
            *
          </span>
        )}
      </label>
      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300"
        style={{
          backgroundColor: focused ? "#FFFFFF" : "#F8FAFF",
          border: `2px solid ${error ? "#EF4444" : focused ? "#17409A" : "#E5E7EB"}`,
          boxShadow: focused ? "0 0 0 4px rgba(23, 64, 154, 0.08)" : "none",
        }}
      >
        <Icon
          className="shrink-0 text-base transition-colors duration-200"
          style={{ color: focused ? "#17409A" : "#9CA3AF" }}
        />
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={placeholder ?? label}
          className="flex-1 text-sm font-semibold bg-transparent outline-none placeholder:font-normal"
          style={{ color: "#1A1A2E", fontFamily: "'Nunito', sans-serif" }}
        />
      </div>
      {error && (
        <p
          className="mt-1.5 text-xs font-semibold"
          style={{ color: "#EF4444" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export function SelectField({
  icon: Icon,
  label,
  value,
  onChange,
  options,
  required,
  disabled,
  error,
}: {
  icon: ElementType;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label
        className="block text-xs font-bold mb-1.5"
        style={{
          color: focused ? "#17409A" : "#6B7280",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {label}
        {required && (
          <span className="ml-1" style={{ color: "#FF6B9D" }}>
            *
          </span>
        )}
      </label>
      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300"
        style={{
          backgroundColor: disabled
            ? "#F0F2F7"
            : focused
              ? "#FFFFFF"
              : "#F8FAFF",
          border: `2px solid ${error ? "#EF4444" : focused && !disabled ? "#17409A" : "#E5E7EB"}`,
          boxShadow:
            focused && !disabled ? "0 0 0 4px rgba(23, 64, 154, 0.08)" : "none",
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? "not-allowed" : "default",
        }}
      >
        <Icon
          className="shrink-0 text-base"
          style={{ color: focused && !disabled ? "#17409A" : "#9CA3AF" }}
        />
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          disabled={disabled}
          className="flex-1 text-sm font-semibold bg-transparent outline-none disabled:cursor-not-allowed"
          style={{
            color: value ? "#1A1A2E" : "#9CA3AF",
            fontFamily: "'Nunito', sans-serif",
          }}
        >
          <option value="" disabled>
            {label}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      {error && (
        <p
          className="mt-1.5 text-xs font-semibold"
          style={{ color: "#EF4444" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}

export function SearchableSelectField({
  icon: Icon,
  label,
  value,
  onChange,
  options,
  required,
  disabled,
  error,
}: {
  icon: ElementType;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  required?: boolean;
  disabled?: boolean;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const selected = options.find((o) => o.value === value);
    if (selected && !open) {
      setSearch(selected.label);
    } else if (!value && !open) {
      setSearch("");
    }
  }, [value, options, open]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative">
      <label
        className="block text-xs font-bold mb-1.5"
        style={{
          color: focused || open ? "#17409A" : "#6B7280",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {label}
        {required && (
          <span className="ml-1" style={{ color: "#FF6B9D" }}>
            *
          </span>
        )}
      </label>
      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-300 relative cursor-text"
        onClick={() => {
          if (!disabled) {
            setOpen(true);
          }
        }}
        style={{
          backgroundColor: disabled
            ? "#F0F2F7"
            : focused || open
              ? "#FFFFFF"
              : "#F8FAFF",
          border: `2px solid ${
            error ? "#EF4444" : focused || open ? "#17409A" : "#E5E7EB"
          }`,
          boxShadow:
            (focused || open) && !disabled
              ? "0 0 0 4px rgba(23, 64, 154, 0.08)"
              : "none",
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <Icon
          className="shrink-0 text-base"
          style={{
            color: (focused || open) && !disabled ? "#17409A" : "#9CA3AF",
          }}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => {
            setFocused(true);
            setOpen(true);
          }}
          onBlur={() => setFocused(false)}
          placeholder={label}
          disabled={disabled}
          className="flex-1 text-sm font-semibold bg-transparent outline-none disabled:cursor-not-allowed"
          style={{
            color: search ? "#1A1A2E" : "#9CA3AF",
            fontFamily: "'Nunito', sans-serif",
          }}
        />
        <IoChevronDown
          className="shrink-0 text-sm transition-transform duration-300"
          style={{
            color: "#9CA3AF",
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
          }}
        />
      </div>

      {open && !disabled && (
        <div
          className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl overflow-y-auto z-50 py-2 custom-scrollbar"
          style={{
            maxHeight: "240px",
            border: "1px solid #E5E7EB",
          }}
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((o) => (
              <div
                key={o.value}
                className="px-4 py-3 cursor-pointer text-sm font-semibold transition-colors"
                style={{
                  color: value === o.value ? "#17409A" : "#1A1A2E",
                  backgroundColor: value === o.value ? "#F4F7FF" : "transparent",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#F8FAFF")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    value === o.value ? "#F4F7FF" : "transparent")
                }
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(o.value);
                  setSearch(o.label);
                  setOpen(false);
                }}
              >
                {o.label}
              </div>
            ))
          ) : (
            <div className="px-4 py-4 text-sm font-semibold text-center" style={{ color: "#9CA3AF" }}>
              Không tìm thấy kết quả
            </div>
          )}
        </div>
      )}

      {error && (
        <p
          className="mt-1.5 text-xs font-semibold"
          style={{ color: "#EF4444" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
