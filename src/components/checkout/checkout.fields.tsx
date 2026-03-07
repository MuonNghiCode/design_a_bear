"use client";

import { useState } from "react";
import type { ElementType } from "react";

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
