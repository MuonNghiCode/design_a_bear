"use client";

import { useMemo } from "react";
import { REVENUE_COMPARISON } from "@/data/admin";

interface RevenueComparisonProps {
  data?: number[];
  lastYearData?: number[];
  labels?: string[];
  title?: string;
  subtitle?: string;
  thisYearLabel?: string;
  lastYearLabel?: string;
}

// SVG dimensions
const W = 480,
  H = 160;
const PAD_L = 36,
  PAD_R = 20,
  PAD_T = 12,
  PAD_B = 28;
const CHART_W = W - PAD_L - PAD_R;
const CHART_H = H - PAD_T - PAD_B;

export default function RevenueComparison({
  data,
  lastYearData,
  labels,
  title = "So sánh doanh thu",
  subtitle = "Năm nay vs Năm ngoái",
  thisYearLabel = "2026",
  lastYearLabel = "2025",
}: RevenueComparisonProps) {
  // Use provided props or fall back to mock data
  const currentData = data || REVENUE_COMPARISON.thisYear;
  const prevData =
    lastYearData || (data ? undefined : REVENUE_COMPARISON.lastYear);
  const currentLabels = labels || REVENUE_COMPARISON.labels;

  const N = currentData.length;

  const MAX_V = useMemo(() => {
    const combined = [...currentData, ...(prevData || [])];
    const m = Math.max(...combined);
    return m === 0 ? 100 : m * 1.2;
  }, [currentData, prevData]);

  const xAt = (i: number) => PAD_L + (i / (N - 1 || 1)) * CHART_W;
  const yAt = (v: number) => PAD_T + (1 - v / MAX_V) * CHART_H;

  const smoothPath = (values: number[]) => {
    if (values.length < 2) return "";
    const cp = (xAt(1) - xAt(0)) * 0.38;
    return values.reduce((acc, v, i) => {
      const x = xAt(i),
        y = yAt(v);
      if (i === 0) return `M ${x.toFixed(1)} ${y.toFixed(1)}`;
      const px = xAt(i - 1),
        py = yAt(values[i - 1]);
      return `${acc} C ${(px + cp).toFixed(1)} ${py.toFixed(1)} ${(x - cp).toFixed(1)} ${y.toFixed(1)} ${x.toFixed(1)} ${y.toFixed(1)}`;
    }, "");
  };

  const thisYearPath = useMemo(
    () => smoothPath(currentData),
    [currentData, MAX_V, N],
  );
  const lastYearPath = useMemo(
    () => (prevData ? smoothPath(prevData) : ""),
    [prevData, MAX_V, N],
  );

  const thisYearPts = useMemo(
    () => currentData.map((v, i) => ({ x: xAt(i), y: yAt(v) })),
    [currentData, MAX_V, N],
  );
  const lastYearPts = useMemo(
    () => (prevData ? prevData.map((v, i) => ({ x: xAt(i), y: yAt(v) })) : []),
    [prevData, MAX_V, N],
  );

  const GRID_Y = [MAX_V, MAX_V * 0.66, MAX_V * 0.33];

  const thisTotal = currentData.reduce((a, b) => a + b, 0);
  const lastTotal = prevData ? prevData.reduce((a, b) => a + b, 0) : 0;

  const growth =
    prevData && lastTotal > 0
      ? (((thisTotal - lastTotal) / lastTotal) * 100).toFixed(1)
      : "0";

  // Guard: cần ít nhất 2 điểm để vẽ đường biểu đồ
  if (N < 2) {
    return (
      <div className="bg-white rounded-3xl p-6 h-full flex flex-col shadow-sm border border-[#F4F7FF] items-center justify-center gap-3">
        <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase">
          {title}
        </p>
        <p className="text-[#1A1A2E] font-black text-xl">{subtitle}</p>
        <p className="text-[#D1D5DB] font-bold text-sm mt-4">
          Đang tải dữ liệu biểu đồ...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 h-full flex flex-col shadow-sm border border-[#F4F7FF]">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase">
            {title}
          </p>
          <p className="text-[#1A1A2E] font-black text-xl mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-black">
          <span className="flex items-center gap-1.5">
            <span className="w-6 h-0.5 bg-[#17409A] rounded inline-block" />
            <span className="text-[#6B7280]">{thisYearLabel}</span>
          </span>
          {prevData && (
            <span className="flex items-center gap-1.5">
              <span
                className="w-6 h-0.5 bg-[#9CA3AF] rounded inline-block border-dashed"
                style={{ borderTop: "2px dashed #9CA3AF", height: 0 }}
              />
              <span className="text-[#9CA3AF]">{lastYearLabel}</span>
            </span>
          )}
        </div>
      </div>

      {/* SVG chart */}
      <div className="flex-1 min-h-0">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Grid lines */}
          {GRID_Y.map((v, i) => {
            const y = yAt(v);
            return (
              <g key={i}>
                <line
                  x1={PAD_L}
                  y1={y}
                  x2={W - PAD_R}
                  y2={y}
                  stroke="#F4F7FF"
                  strokeWidth={1}
                />
                <text
                  x={PAD_L - 4}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize={8}
                  fill="#9CA3AF"
                  fontFamily="Nunito, sans-serif"
                >
                  {v >= 1000000
                    ? (v / 1000000).toFixed(1) + "M"
                    : v >= 1000
                      ? (v / 1000).toFixed(1) + "K"
                      : Math.round(v)}
                </text>
              </g>
            );
          })}

          {/* Last year line */}
          {prevData && (
            <path
              d={lastYearPath}
              fill="none"
              stroke="#D1D5DB"
              strokeWidth={2}
              strokeDasharray="6 3"
            />
          )}

          {/* This year line */}
          <path
            d={thisYearPath}
            fill="none"
            stroke="#17409A"
            strokeWidth={2.5}
          />

          {/* Dots — last year */}
          {prevData &&
            lastYearPts.map((pt, i) => (
              <circle key={i} cx={pt.x} cy={pt.y} r={2.5} fill="#D1D5DB" />
            ))}

          {/* Dots — this year */}
          {thisYearPts.map((pt, i) => (
            <g key={i}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={N > 15 ? 2.5 : 4}
                fill="white"
                stroke="#17409A"
                strokeWidth={N > 15 ? 1 : 2}
              />
              {/* Value label on last point */}
              {i === N - 1 && N <= 15 && (
                <text
                  x={pt.x + 8}
                  y={pt.y + 4}
                  fontSize={9}
                  fill="#17409A"
                  fontFamily="Nunito, sans-serif"
                  fontWeight="800"
                >
                  {currentData[i]?.toLocaleString()}
                </text>
              )}
            </g>
          ))}

          {/* Labels */}
          {currentLabels.map((label, i) => {
            // Show all labels if N is small, otherwise space them out
            if (N > 12 && i % Math.ceil(N / 8) !== 0 && i !== N - 1)
              return null;
            return (
              <text
                key={i}
                x={xAt(i)}
                y={H - 4}
                textAnchor="middle"
                fontSize={9}
                fill={i === N - 1 ? "#17409A" : "#9CA3AF"}
                fontFamily="Nunito, sans-serif"
                fontWeight={i === N - 1 ? "800" : "600"}
              >
                {label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Footer summary */}
      <div className="flex items-center gap-6 mt-3 pt-4 border-t border-[#F4F7FF]">
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-wider uppercase">
            {thisYearLabel}
          </p>
          <p className="text-[#1A1A2E] font-black text-lg">
            {thisTotal.toLocaleString("vi-VN")}
          </p>
        </div>
        {prevData && (
          <div>
            <p className="text-[#9CA3AF] text-[10px] font-black tracking-wider uppercase">
              {lastYearLabel}
            </p>
            <p className="text-[#9CA3AF] font-black text-lg">
              {lastTotal.toLocaleString("vi-VN")}
            </p>
          </div>
        )}
        {growth !== "0" && (
          <div className="ml-auto">
            <span className="bg-[#4ECDC4]/15 text-[#4ECDC4] font-black text-sm px-3 py-1.5 rounded-xl">
              {+growth >= 0 ? "↑" : "↓"} {Math.abs(+growth)}% tăng trưởng
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
