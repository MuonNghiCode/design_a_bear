import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants/api";
import type {
  GetRevenueReportRequest,
  GetRevenueReportResponse,
  RevenueReportData,
} from "@/types";

export interface PayrollMeResponse {
  userId: string;
  employeeName: string;
  email: string;
  roleId: number;
  startDate: string;
  endDate: string;
  jobsCount: number;
  craftsmanAmount: number;
  qcAmount: number;
  staffAmount: number;
  totalAmount: number;
}

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

  async getPayrollReport(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<any> {
    return this.get<any>(
      API_ENDPOINTS.REPORTS.PAYROLL,
      params as unknown as Record<string, unknown>,
      { withCredentials: false },
    );
  }

  async getMyPayroll(params?: {
    startDate?: string;
    endDate?: string;
  }): Promise<any> {
    return this.get<any>(
      API_ENDPOINTS.REPORTS.PAYROLL_ME,
      params as unknown as Record<string, unknown>,
      { withCredentials: false },
    );
  }
}

export const reportService = new ReportService();
