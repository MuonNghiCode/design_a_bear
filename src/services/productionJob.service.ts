import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type { 
  ApiResponse, 
  ProductionJob, 
  ProductionPartType, 
  ProductionStatus,
  HandoverProductionPartRequest,
  UpdateProductionPartStatusRequest
} from "@/types";

class ProductionJobService extends BaseApiService {
  async getLobby(): Promise<ApiResponse<ProductionJob[]>> {
    return this.get<ProductionJob[]>(`${API_ENDPOINTS.PRODUCTION_JOBS.BASE}/lobby`);
  }

  async claimJob(id: string): Promise<ApiResponse<void>> {
    return this.post<void>(`${API_ENDPOINTS.PRODUCTION_JOBS.BASE}/${id}/claim`);
  }

  async getById(id: string): Promise<ApiResponse<ProductionJob>> {
    return this.get<ProductionJob>(`${API_ENDPOINTS.PRODUCTION_JOBS.BASE}/${id}`);
  }

  async getByStatus(status: ProductionStatus): Promise<ApiResponse<ProductionJob[]>> {
    return this.get<ProductionJob[]>(`${API_ENDPOINTS.PRODUCTION_JOBS.BASE}/status/${status}`);
  }

  async getByTechnician(technicianId: string): Promise<ApiResponse<ProductionJob[]>> {
    return this.get<ProductionJob[]>(`${API_ENDPOINTS.PRODUCTION_JOBS.BASE}/technician/${technicianId}`);
  }

  async updatePartStatus(id: string, partType: ProductionPartType, status: ProductionStatus): Promise<ApiResponse<void>> {
    const payload: UpdateProductionPartStatusRequest = { partType, status };
    return this.put<void>(`${API_ENDPOINTS.PRODUCTION_JOBS.BASE}/${id}/part-status`, payload);
  }

  async handoverPart(id: string, partType: ProductionPartType, photoUrls: string[], note?: string): Promise<ApiResponse<void>> {
    const payload: HandoverProductionPartRequest = { partType, photoUrls, note };
    return this.post<void>(`${API_ENDPOINTS.PRODUCTION_JOBS.BASE}/${id}/handover`, payload);
  }

  async submitInspection(id: string, score: number, notes: string, isApproved: boolean): Promise<ApiResponse<void>> {
    return this.post<void>(`${API_ENDPOINTS.PRODUCTION_JOBS.BASE}/${id}/qc-inspection`, { score, notes, isApproved });
  }
}

export const productionJobService = new ProductionJobService();
