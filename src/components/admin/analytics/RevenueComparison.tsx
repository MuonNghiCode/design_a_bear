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
const PAD_L = 40,
  PAD_R = 20,
  PAD_T = 12,
  PAD_B = 28;
const CHART_W = W - PAD_L - PAD_R;
const CHART_H = H - PAD_T - PAD_B;

export default function RevenueComparison({
  data,
  lastYearData,
  labels,
  title = "Phân tích doanh thu",
  subtitle = "Dữ liệu thống kê thời gian thực",
  thisYearLabel = "Kỳ hiện tại",
  lastYearLabel = "Kỳ trước",
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
    const cp = (xAt(1) - xAt(0)) * 0.4;
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

  const GRID_Y = [MAX_V, MAX_V * 0.66, MAX_V * 0.33];

  const thisTotal = currentData.reduce((a, b) => a + b, 0);
  const lastTotal = prevData ? prevData.reduce((a, b) => a + b, 0) : 0;

  const growth =
    prevData && lastTotal > 0
      ? (((thisTotal - lastTotal) / lastTotal) * 100).toFixed(1)
      : "0";

  // Guard: need at least 2 points
  if (N < 2) {
    return (
      <div className="bg-white rounded-[32px] p-8 h-full flex flex-col shadow-sm border border-[#F0F0F8] items-center justify-center">
        <p className="text-[#9CA3AF] text-[10px] font-black tracking-widest uppercase">
          {title}
        </p>
        <p className="text-[#D1D5DB] font-bold text-sm mt-4">
          Đang cập nhật dữ liệu...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[32px] p-8 h-full flex flex-col shadow-sm border border-[#F0F0F8]" style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif" }}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.25em] uppercase">
            {title}
          </p>
          <p className="text-[#1A1A2E] font-black text-xl mt-1 tracking-tight">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-[#17409A] rounded-full inline-block" />
            <span className="text-[#17409A]">{thisYearLabel}</span>
          </span>
          {prevData && (
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-[#D1D5DB] rounded-full inline-block" />
              <span className="text-[#9CA3AF]">{lastYearLabel}</span>
            </span>
          )}
        </div>
      </div>

      {/* SVG chart */}
      <div className="flex-1 min-h-0">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="w-full h-full overflow-visible"
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
                  stroke="#F8F9FF"
                  strokeWidth={1}
                />
                <text
                  x={PAD_L - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize={8}
                  fill="#9CA3AF"
                  fontFamily="inherit"
                  fontWeight="bold"
                >
                  {v >= 1000000
                    ? (v / 1000000).toFixed(1) + "M"
                    : v >= 1000
                      ? (v / 1000).toFixed(0) + "K"
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
              stroke="#E5E7EB"
              strokeWidth={2}
              strokeDasharray="4 4"
            />
          )}

          {/* This year line */}
          <path
            d={thisYearPath}
            fill="none"
            stroke="#17409A"
            strokeWidth={3}
            strokeLinecap="round"
          />

          {/* Dots — this year */}
          {thisYearPts.map((pt, i) => {
            if (N > 15 && i % Math.ceil(N / 10) !== 0 && i !== N - 1) return null;
            return (
              <circle
                key={i}
                cx={pt.x}
                cy={pt.y}
                r={4}
                fill="white"
                stroke="#17409A"
                strokeWidth={2}
              />
            );
          })}

          {/* Labels */}
          {currentLabels.map((label, i) => {
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
                fontFamily="inherit"
                fontWeight="black"
              >
                {label}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Footer summary */}
      <div className="flex items-center gap-8 mt-6 pt-6 border-t border-[#F0F0F8]">
        <div>
          <p className="text-[#9CA3AF] text-[9px] font-black tracking-widest uppercase">
            {thisYearLabel}
          </p>
          <p className="text-[#17409A] font-black text-xl">
            {thisTotal.toLocaleString("vi-VN")} đ
          </p>
        </div>
        {prevData && (
          <div>
            <p className="text-[#9CA3AF] text-[9px] font-black tracking-widest uppercase">
              {lastYearLabel}
            </p>
            <p className="text-[#9CA3AF] font-bold text-xl">
              {lastTotal.toLocaleString("vi-VN")} đ
            </p>
          </div>
        )}
        {growth !== "0" && (
          <div className="ml-auto">
            <span className={`font-black text-xs px-4 py-2 rounded-2xl ${+growth >= 0 ? "bg-[#4ECDC415] text-[#4ECDC4]" : "bg-[#FF6B9D15] text-[#FF6B9D]"}`}>
              {+growth >= 0 ? "+" : ""}{growth}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
