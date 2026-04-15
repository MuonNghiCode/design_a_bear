"use client";

import { useEffect, useState, useMemo } from "react";
import { useAdminReportsApi } from "@/hooks";
import { MdCalendarToday } from "react-icons/md";
import AnalyticsKPIs from "@/components/admin/analytics/AnalyticsKPIs";
import RevenueComparison from "@/components/admin/analytics/RevenueComparison";
import { format } from "date-fns";

export default function RevenueReportClient() {
  const { loading, revenueData, fetchRevenueReport, error } =
    useAdminReportsApi();

  // Default range: last 30 days
  const [dateRange, setDateRange] = useState({
    startDate: format(
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      "yyyy-MM-dd",
    ),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  useEffect(() => {
    fetchRevenueReport({
      startDate: new Date(dateRange.startDate + "T00:00:00Z").toISOString(),
      endDate: new Date(dateRange.endDate + "T23:59:59Z").toISOString(),
    });
  }, [dateRange, fetchRevenueReport]);

  const kpiStats = useMemo(
    () => [
      {
        label: "Tổng doanh thu",
        value: (revenueData?.totalRevenue ?? 0).toLocaleString("vi-VN"),
        unit: "VND",
      },
      {
        label: "Tổng lợi nhuận",
        value: (revenueData?.totalProfit ?? 0).toLocaleString("vi-VN"),
        unit: "VND",
      },
      {
        label: "Tổng đơn hàng",
        value: revenueData?.totalOrders ?? 0,
        unit: "đơn",
      },
      {
        label: "Giá trị đơn TB",
        value: revenueData?.totalOrders
          ? Math.round(
              (revenueData?.totalRevenue ?? 0) / revenueData.totalOrders,
            ).toLocaleString("vi-VN")
          : "0",
        unit: "VND",
      },
    ],
    [revenueData],
  );

  const chartData = useMemo(() => {
    if (!revenueData?.dailyBreakdown) return [];
    return revenueData.dailyBreakdown.map((d) => d.revenue);
  }, [revenueData]);

  const chartLabels = useMemo(() => {
    if (!revenueData?.dailyBreakdown) return [];
    return revenueData.dailyBreakdown.map((d) =>
      format(new Date(d.date), "dd/MM"),
    );
  }, [revenueData]);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header & Filter */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div>
          <h1 className="text-[#1A1A2E] font-black text-[28px] font-fredoka leading-tight">
            Báo cáo doanh thu
          </h1>
          <p className="text-[#9CA3AF] text-sm font-semibold mt-1">
            Từ {format(new Date(dateRange.startDate), "dd/MM/yyyy")} đến{" "}
            {format(new Date(dateRange.endDate), "dd/MM/yyyy")}
          </p>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-2xl shadow-sm border border-[#F4F7FF]">
          <div className="flex items-center gap-2 px-2 py-1">
            <MdCalendarToday className="text-[#9CA3AF] text-sm" />
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, startDate: e.target.value }))
              }
              className="text-[11px] font-black text-[#1A1A2E] outline-none bg-transparent uppercase tracking-wider"
            />
          </div>
          <div className="w-px h-4 bg-[#F4F7FF]" />
          <div className="flex items-center gap-2 px-2 py-1">
            <MdCalendarToday className="text-[#9CA3AF] text-sm" />
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, endDate: e.target.value }))
              }
              className="text-[11px] font-black text-[#1A1A2E] outline-none bg-transparent uppercase tracking-wider"
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded-2xl text-sm font-bold border border-red-100">
          ⚠️ {error}
        </div>
      )}

      {/* Row 1 — KPI strip */}
      <div
        className={
          loading ? "opacity-50 pointer-events-none transition-opacity" : ""
        }
      >
        <AnalyticsKPIs stats={kpiStats} />
      </div>

      {/* Row 2 — Revenue chart */}
      <div
        className={`h-[380px] ${loading ? "opacity-50 pointer-events-none transition-opacity" : ""}`}
      >
        <RevenueComparison
          data={chartData}
          labels={chartLabels}
          title="Biểu đồ xu hướng"
          subtitle="Doanh thu chi tiết theo từng ngày"
          thisYearLabel="Khoảng thời gian chọn"
        />
      </div>

      {/* Row 3 — Data Table */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-[#F4F7FF]">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-[#1A1A2E] font-black text-xl font-fredoka">
              Chi tiết doanh thu
            </h3>
            <p className="text-[#9CA3AF] text-[10px] font-black tracking-widest uppercase mt-1">
              Bảng kê khai chi tiết theo ngày
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#F4F7FF]">
                <th className="text-left py-4 text-[#9CA3AF] text-[10px] font-black uppercase tracking-[0.2em]">
                  Ngày
                </th>
                <th className="text-right py-4 text-[#9CA3AF] text-[10px] font-black uppercase tracking-[0.2em]">
                  Doanh thu
                </th>
                <th className="text-right py-4 text-[#9CA3AF] text-[10px] font-black uppercase tracking-[0.2em]">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F7FF]">
              {loading ? (
                <tr>
                  <td
                    colSpan={3}
                    className="py-20 text-center text-[#9CA3AF] font-bold animate-pulse"
                  >
                    Đang đồng bộ dữ liệu...
                  </td>
                </tr>
              ) : (
                (revenueData?.dailyBreakdown ?? [])
                  .slice()
                  .reverse()
                  .map((item, i) => (
                    <tr
                      key={item.date}
                      className="group hover:bg-[#F4F7FF]/50 transition-colors"
                    >
                      <td className="py-5 font-bold text-[#1A1A2E] text-sm">
                        {format(new Date(item.date), "dd/MM/yyyy")}
                      </td>
                      <td className="py-5 text-right font-black text-[#17409A] text-base">
                        {item.revenue.toLocaleString("vi-VN")}{" "}
                        <span className="text-[10px] text-[#9CA3AF] ml-0.5">
                          VND
                        </span>
                      </td>
                      <td className="py-5 text-right">
                        <span
                          className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-wider ${
                            item.revenue > 0
                              ? "bg-[#4ECDC4]/10 text-[#4ECDC4]"
                              : "bg-[#9CA3AF]/10 text-[#9CA3AF]"
                          }`}
                        >
                          {item.revenue > 0 ? "CÓ DOANH THU" : "TRỐNG"}
                        </span>
                      </td>
                    </tr>
                  ))
              )}
              {!revenueData?.dailyBreakdown?.length && !loading && (
                <tr>
                  <td
                    colSpan={3}
                    className="py-20 text-center text-[#9CA3AF] font-bold"
                  >
                    Không có bản ghi nào trong khoảng thời gian này
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
