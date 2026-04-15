"use client";

import { useCallback, useState } from "react";
import { reportService } from "@/services/report.service";
import type {
  GetRevenueReportRequest,
  RevenueReportData,
} from "@/types";

export function useAdminReportsApi() {
  const [loading, setLoading] = useState(false);
  const [revenueData, setRevenueData] = useState<RevenueReportData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchRevenueReport = useCallback(async (params: GetRevenueReportRequest) => {
    setLoading(true);
    setError(null);
    try {
      const res = await reportService.getRevenueReport(params);
      if (res.isSuccess) {
        setRevenueData(res.value);
        return res.value;
      } else {
        setError(res.error.description || "Lỗi khi tải báo cáo doanh thu");
        return null;
      }
    } catch (err: unknown) {
      console.error("Fetch Revenue Report Error:", err);
      setError("Không thể kết nối tới máy chủ");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    revenueData,
    error,
    fetchRevenueReport,
  };
}
