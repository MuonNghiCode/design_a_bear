import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse, GetProductIssuesResponseData } from "@/types";
import type {
  ProductIssueReport,
  CreateProductIssueRequest,
  ResolveProductIssueRequest,
  CompleteProductIssueRequest,
  RejectProductIssueRequest,
} from "@/types";

class ProductIssueService extends BaseApiService {
  async createIssueReport(
    data: CreateProductIssueRequest,
  ): Promise<ApiResponse<ProductIssueReport>> {
    return this.post<ProductIssueReport>(
      API_ENDPOINTS.PRODUCT_ISSUE_REPORTS.BASE,
      data,
      { withCredentials: false },
    );
  }

  async getIssueById(id: string): Promise<ApiResponse<ProductIssueReport>> {
    const url = API_ENDPOINTS.PRODUCT_ISSUE_REPORTS.GET_BY_ID.replace(
      "{id}",
      id,
    );
    return this.get<ProductIssueReport>(url, undefined, {
      withCredentials: false,
    });
  }

  async getMyIssues(params?: {
    pageIndex?: number;
    pageSize?: number;
  }): Promise<ApiResponse<GetProductIssuesResponseData>> {
    return this.get<GetProductIssuesResponseData>(
      API_ENDPOINTS.PRODUCT_ISSUE_REPORTS.MY_REPORTS,
      params as Record<string, unknown>,
      { withCredentials: false },
    );
  }

  async getIssuesByStatus(
    status: string,
    params?: {
      pageIndex?: number;
      pageSize?: number;
    },
  ): Promise<ApiResponse<GetProductIssuesResponseData>> {
    const url = API_ENDPOINTS.PRODUCT_ISSUE_REPORTS.BY_STATUS.replace(
      "{status}",
      status,
    );
    return this.get<GetProductIssuesResponseData>(
      url,
      params as Record<string, unknown>,
      { withCredentials: false },
    );
  }

  async getAllIssues(params: {
    status?: string | null;
    pageIndex?: number;
    pageSize?: number;
    userId?: string;
    productId?: string;
  }): Promise<ApiResponse<GetProductIssuesResponseData>> {
    return this.get<GetProductIssuesResponseData>(
      API_ENDPOINTS.PRODUCT_ISSUE_REPORTS.BASE,
      params as Record<string, unknown>,
      { withCredentials: false },
    );
  }

  async assignIssue(id: string): Promise<ApiResponse<null>> {
    const url = API_ENDPOINTS.PRODUCT_ISSUE_REPORTS.ASSIGN.replace("{id}", id);
    return this.put<null>(url, {}, { withCredentials: false });
  }

  async resolveIssue(
    id: string,
    data: ResolveProductIssueRequest,
  ): Promise<ApiResponse<null>> {
    const url = API_ENDPOINTS.PRODUCT_ISSUE_REPORTS.RESOLVE.replace("{id}", id);
    return this.put<null>(url, data, { withCredentials: false });
  }

  async completeIssue(
    id: string,
    data: CompleteProductIssueRequest,
  ): Promise<ApiResponse<null>> {
    const url = API_ENDPOINTS.PRODUCT_ISSUE_REPORTS.COMPLETE.replace(
      "{id}",
      id,
    );
    return this.put<null>(url, data, { withCredentials: false });
  }

  async rejectIssue(
    id: string,
    data: RejectProductIssueRequest,
  ): Promise<ApiResponse<null>> {
    const url = API_ENDPOINTS.PRODUCT_ISSUE_REPORTS.REJECT.replace("{id}", id);
    return this.put<null>(url, data, { withCredentials: false });
  }
}

export const productIssueService = new ProductIssueService();
