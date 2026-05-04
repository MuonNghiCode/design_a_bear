"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  MdCalendarToday,
  MdRefresh,
  MdAttachMoney,
  MdWorkHistory,
  MdAssignmentTurnedIn,
} from "react-icons/md";
import { reportService } from "@/services/report.service";

function formatVND(n: number) {
  return (n || 0).toLocaleString("vi-VN") + " đ";
}

interface Props {
  roleName: string;
}

export default function PersonalPayrollClient({ roleName }: Props) {
  const [dateRange, setDateRange] = useState({
    startDate: format(
      new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      "yyyy-MM-dd"
    ),
    endDate: format(new Date(), "yyyy-MM-dd"),
  });

  const [loading, setLoading] = useState(false);
  const [payrollData, setPayrollData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchMyPayroll = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await reportService.getMyPayroll({
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
      });
      if (res && res.isSuccess && res.value) {
        setPayrollData(res.value);
      } else {
        setError("Không thể tải thông tin thù lao.");
      }
    } catch (err) {
      console.error(err);
      setError("Có lỗi xảy ra khi lấy dữ liệu bảng lương.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyPayroll();
  }, [dateRange.startDate, dateRange.endDate]);

  const kpis = [
    {
      label: "Tổng thu nhập kỳ này",
      value: formatVND(payrollData?.totalAmount),
      icon: MdAttachMoney,
      accent: "#17409A",
      primary: true,
    },
    {
      label: "Công việc đã hoàn tất",
      value: `${payrollData?.jobsCount || 0} việc`,
      icon: MdAssignmentTurnedIn,
      accent: "#7C5CFC",
    },
    {
      label: "Loại thù lao",
      value: roleName,
      icon: MdWorkHistory,
      accent: "#4ECDC4",
    },
  ];

  return (
    <div
      className="flex flex-col gap-8 pb-12"
      style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif" }}
    >
      {/* Page Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-[#1A1A2E] font-black text-3xl tracking-tight">
            Thù Lao & Lương Thưởng
          </h1>
          <p className="text-[#9CA3AF] text-sm font-bold mt-1">
            Theo dõi chi tiết hoa hồng và thù lao công việc của bạn
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Date Selector */}
          <div className="flex items-center gap-2 bg-white px-5 py-3 rounded-2xl shadow-sm border border-[#F0F0F8]">
            <MdCalendarToday className="text-[#9CA3AF] text-sm shrink-0" />
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) =>
                setDateRange((p) => ({ ...p, startDate: e.target.value }))
              }
              className="text-[11px] font-black text-[#1A1A2E] outline-none bg-transparent tracking-widest"
            />
            <span className="text-[#9CA3AF] text-[10px] font-black uppercase">
              đến
            </span>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) =>
                setDateRange((p) => ({ ...p, endDate: e.target.value }))
              }
              className="text-[11px] font-black text-[#1A1A2E] outline-none bg-transparent tracking-widest"
            />
          </div>

          <button
            onClick={fetchMyPayroll}
            disabled={loading}
            className="p-3 rounded-2xl bg-white border border-[#F0F0F8] text-[#17409A] hover:bg-[#F4F7FF] transition-all shadow-sm cursor-pointer disabled:opacity-50"
          >
            <MdRefresh className={`text-xl ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-3xl text-sm font-bold border border-red-100 shadow-sm">
          Lỗi: {error}
        </div>
      )}

      {/* Statistics Cards */}
      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div
                key={kpi.label}
                className={`rounded-4xl p-8 flex items-start gap-6 shadow-sm border border-[#F0F0F8] transition-all hover:shadow-xl ${
                  kpi.primary
                    ? "bg-[#17409A] text-white shadow-lg shadow-[#17409A]/20"
                    : "bg-white text-[#1A1A2E]"
                }`}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: kpi.primary
                      ? "rgba(255,255,255,0.15)"
                      : kpi.accent + "15",
                  }}
                >
                  <Icon
                    className="text-2xl"
                    style={{ color: kpi.primary ? "#fff" : kpi.accent }}
                  />
                </div>
                <div>
                  <p
                    className={`text-[10px] font-black tracking-[0.25em] uppercase ${
                      kpi.primary ? "text-white/60" : "text-[#9CA3AF]"
                    }`}
                  >
                    {kpi.label}
                  </p>
                  <p className="font-black text-2xl mt-1 leading-none">
                    {kpi.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Breakdown */}
      <div className="bg-white rounded-[40px] shadow-sm border border-[#F0F0F8] overflow-hidden p-10 flex flex-col gap-8">
        <div>
          <h3 className="text-[#1A1A2E] font-black text-xl tracking-tight">
            Chi tiết thù lao trong kỳ
          </h3>
          <p className="text-[#9CA3AF] text-sm font-bold mt-1">
            Ghi nhận thù lao cá nhân từ hệ thống
          </p>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center gap-4 text-[#9CA3AF]">
            <div className="w-12 h-12 border-4 border-[#17409A] border-t-transparent rounded-full animate-spin" />
            <p className="font-black text-sm uppercase tracking-widest">
              Đang tải dữ liệu...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {payrollData?.craftsmanAmount > 0 && (
              <div className="bg-[#F8FAFF] rounded-3xl p-6 border border-[#F0F0F8] flex flex-col justify-between hover:shadow-md transition-all duration-300">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-[#9CA3AF] uppercase">
                    Khoản thù lao
                  </span>
                  <h4 className="text-[#17409A] font-black text-base mt-1">
                    Hoa hồng Thợ thủ công
                  </h4>
                  <p className="text-[#6B7280] text-xs font-medium mt-1">
                    Hoa hồng thù lao cho các sản phẩm đã lắp ráp thành công
                  </p>
                </div>
                <p className="text-[#1A1A2E] font-black text-xl mt-4 leading-none">
                  {formatVND(payrollData.craftsmanAmount)}
                </p>
              </div>
            )}

            {payrollData?.qcAmount > 0 && (
              <div className="bg-[#F8FAFF] rounded-3xl p-6 border border-[#F0F0F8] flex flex-col justify-between hover:shadow-md transition-all duration-300">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-[#9CA3AF] uppercase">
                    Khoản thù lao
                  </span>
                  <h4 className="text-[#7C5CFC] font-black text-base mt-1">
                    Hoa hồng Kiểm định viên
                  </h4>
                  <p className="text-[#6B7280] text-xs font-medium mt-1">
                    Hoa hồng thù lao cho các sản phẩm đã kiểm định thành công
                  </p>
                </div>
                <p className="text-[#1A1A2E] font-black text-xl mt-4 leading-none">
                  {formatVND(payrollData.qcAmount)}
                </p>
              </div>
            )}

            {payrollData?.staffAmount > 0 && (
              <div className="bg-[#F8FAFF] rounded-3xl p-6 border border-[#F0F0F8] flex flex-col justify-between hover:shadow-md transition-all duration-300">
                <div>
                  <span className="text-[10px] font-black tracking-widest text-[#9CA3AF] uppercase">
                    Khoản thù lao
                  </span>
                  <h4 className="text-[#4ECDC4] font-black text-base mt-1">
                    Lương cứng nhân viên
                  </h4>
                  <p className="text-[#6B7280] text-xs font-medium mt-1">
                    Thù lao cố định theo số ngày làm việc trong kỳ
                  </p>
                </div>
                <p className="text-[#1A1A2E] font-black text-xl mt-4 leading-none">
                  {formatVND(payrollData.staffAmount)}
                </p>
              </div>
            )}

            {!(
              payrollData?.craftsmanAmount > 0 ||
              payrollData?.qcAmount > 0 ||
              payrollData?.staffAmount > 0
            ) && (
              <div className="col-span-full py-16 text-center text-[#9CA3AF] font-bold italic">
                Không ghi nhận khoản thù lao nào trong kỳ này
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
