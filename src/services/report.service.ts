import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants/api";
import type {
  GetRevenueReportRequest,
  GetRevenueReportResponse,
  RevenueReportData,
} from "@/types";

class ReportService extends BaseApiService {
  async getRevenueReport(
    params: GetRevenueReportRequest,
  ): Promise<GetRevenueReportResponse> {
    return this.get<RevenueReportData>(
      API_ENDPOINTS.REPORTS.REVENUE,
      params as unknown as Record<string, unknown>,
      { withCredentials: false },
    );
  }
}

export const reportService = new ReportService();
