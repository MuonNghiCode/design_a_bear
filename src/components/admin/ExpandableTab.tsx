"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { MdExpandMore } from "react-icons/md";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface ExpandableTabChild {
  label: string;
  href: string;
}

interface ExpandableTabProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  children: ExpandableTabChild[];
  isActive?: boolean;
  isOpen?: boolean;
  onToggle?: (open: boolean) => void;
  onItemClick?: () => void;
}

export default function ExpandableTab({
  icon: Icon,
  label,
  children,
  isActive = false,
  isOpen = false,
  onToggle,
  onItemClick,
}: ExpandableTabProps) {
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const [internalOpen, setInternalOpen] = useState(isOpen);

  const anyChildActive = children.some((child) =>
    pathname.startsWith(child.href),
  );

  // GSAP animation for opening/closing
  useEffect(() => {
    if (panelRef.current) {
      if (internalOpen) {
        // Open animation
        gsap.fromTo(
          panelRef.current,
          { opacity: 0, y: -8, scaleY: 0.95 },
          {
            opacity: 1,
            y: 0,
            scaleY: 1,
            duration: 0.3,
            ease: "power2.out",
          },
        );
      } else {
        // Close animation
        gsap.to(panelRef.current, {
          opacity: 0,
          y: -8,
          scaleY: 0.95,
          duration: 0.2,
          ease: "power2.in",
        });
      }
    }
  }, [internalOpen]);

  const handleToggle = () => {
    const newState = !internalOpen;
    setInternalOpen(newState);
    onToggle?.(newState);
  };

  const handleItemClick = () => {
    setInternalOpen(false);
    onItemClick?.();
  };

  return (
    <div className="relative">
      {/* Parent Button */}
      <button
        type="button"
        title={label}
        onClick={handleToggle}
        className={`group relative w-11 h-11 rounded-2xl flex items-center justify-center transition-all duration-200 ${
          anyChildActive || internalOpen
            ? "bg-white shadow-lg shadow-white/20"
            : "text-white/50 hover:bg-white/15 hover:text-white"
        }`}
      >
        <Icon
          className={`text-xl ${anyChildActive || internalOpen ? "text-[#17409A]" : ""}`}
        />
        <MdExpandMore
          className={`absolute -bottom-0.5 -right-0.5 text-sm transition-transform ${
            anyChildActive || internalOpen ? "text-[#17409A]" : "text-white/70"
          } ${internalOpen ? "rotate-180" : ""}`}
        />
        {/* Tooltip */}
        <span className="pointer-events-none absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 bg-[#0E2A66] text-white text-xs px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl z-50">
          {label}
        </span>
      </button>

      {/* Dropdown Panel */}
      {internalOpen && (
        <div
          ref={panelRef}
          className="absolute left-[calc(100%+12px)] top-1/2 -translate-y-1/2 z-50 w-44 rounded-2xl border border-white/30 bg-white/95 backdrop-blur-xl shadow-2xl shadow-[#0E2A66]/20 p-2 origin-left"
        >
          <p className="px-2 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#9CA3AF]">
            {label}
          </p>
          <div className="mt-1 space-y-1">
            {children.map((item) => {
              const childActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleItemClick}
                  className={`block rounded-xl px-3 py-2 text-xs font-black transition-colors ${
                    childActive
                      ? "bg-[#17409A] text-white"
                      : "text-[#17409A] hover:bg-[#F4F7FF]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
