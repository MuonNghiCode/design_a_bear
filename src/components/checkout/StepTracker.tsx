"use client";

import { IoCheckmark } from "react-icons/io5";
import { STEPS } from "./checkout.config";

export function StepTracker({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((s, i) => {
        const done = current > s.id;
        const active = current === s.id;
        return (
          <div key={s.id} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="relative w-11 h-11 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-500"
                style={{
                  backgroundColor: done
                    ? "#4ECDC4"
                    : active
                      ? "#17409A"
                      : "#E5E7EB",
                  color: done || active ? "white" : "#9CA3AF",
                  boxShadow: active
                    ? "0 0 0 4px rgba(23, 64, 154, 0.18)"
                    : done
                      ? "0 0 0 4px rgba(78, 205, 196, 0.18)"
                      : "none",
                  transform: active ? "scale(1.08)" : "scale(1)",
                }}
              >
                {/* Ping rendered FIRST so it sits behind the label */}
                {active && (
                  <span
                    className="absolute inset-0 rounded-2xl animate-ping"
                    style={{ backgroundColor: "rgba(23,64,154,0.15)" }}
                  />
                )}
                {/* Label on top of ping via z-10 */}
                <span className="relative z-10 flex items-center justify-center">
                  {done ? (
                    <IoCheckmark className="text-base" />
                  ) : (
                    <span style={{ fontFamily: "'Nunito', sans-serif" }}>
                      {String(s.id).padStart(2, "0")}
                    </span>
                  )}
                </span>
              </div>
              <div className="text-center">
                <p
                  className="text-xs font-bold leading-none"
                  style={{
                    color: active ? "#17409A" : done ? "#4ECDC4" : "#9CA3AF",
                  }}
                >
                  {s.label}
                </p>
                <p className="text-[10px]" style={{ color: "#C4C9D4" }}>
                  {s.sub}
                </p>
              </div>
            </div>
            {i < STEPS.length - 1 && (
              <div className="flex items-center gap-1 px-2 mb-6">
                {[0, 1, 2].map((dot) => (
                  <div
                    key={dot}
                    className="rounded-full transition-all duration-500"
                    style={{
                      width: 5,
                      height: 5,
                      backgroundColor: current > s.id ? "#4ECDC4" : "#E5E7EB",
                      opacity: 1 - dot * 0.2,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
