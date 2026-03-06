import React from "react";

type PawPos = {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  size: number;
  rotate: number;
  opacity: number;
};

export const PAW_POSITIONS: PawPos[] = [
  { top: "8%", left: "6%", size: 44, rotate: -20, opacity: 0.07 },
  { top: "20%", right: "5%", size: 32, rotate: 15, opacity: 0.05 },
  { bottom: "28%", left: "4%", size: 38, rotate: 30, opacity: 0.06 },
  { bottom: "10%", right: "8%", size: 28, rotate: -10, opacity: 0.05 },
];

interface PawDecorationProps {
  positions?: PawPos[];
}

export default function PawDecoration({
  positions = PAW_POSITIONS,
}: PawDecorationProps) {
  return (
    <>
      {positions.map((p, i) => (
        <div
          key={i}
          className="absolute pointer-events-none select-none"
          style={{
            top: p.top,
            bottom: p.bottom,
            left: p.left,
            right: p.right,
            transform: `rotate(${p.rotate}deg)`,
            opacity: p.opacity,
          }}
        >
          <svg
            width={p.size}
            height={p.size}
            viewBox="0 0 100 100"
            fill="white"
          >
            <ellipse cx="50" cy="65" rx="30" ry="25" />
            <ellipse cx="22" cy="38" rx="12" ry="10" />
            <ellipse cx="78" cy="38" rx="12" ry="10" />
            <ellipse cx="12" cy="58" rx="9" ry="8" />
            <ellipse cx="88" cy="58" rx="9" ry="8" />
          </svg>
        </div>
      ))}
    </>
  );
}
