import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";

export interface BuildComponent {
  buildComponentId: string;
  productName: string;
  quantity: number;
  imageUrl?: string;
  size?: string;
  weightGram?: number;
}

export interface ProductionJob {
  jobId: string;
  orderItemId: string;
  status: string;
  hasSmartChip: boolean;
  assignedUser?: string;
  technicianName?: string;
  startedAt?: string;
  completedAt?: string;
  serialNumber?: string;
  espStatus?: string;
  espHandoverPhotoUrls?: string;
  shellStatus?: string;
  shellHandoverPhotoUrls?: string;
  qcStatus?: string;
  qualityScore?: number;
  rejectionReason?: string;
  notes?: string;
  productName?: string;
  imageUrl?: string; // Base product image
  size?: string;     // Base product size
  weightGram?: number; // Base product weight
  components: BuildComponent[];
}

export interface HandoverRequest {
  photoUrls: string[];
  note?: string;
  metadata?: string;
}

export interface InspectionRequest {
  score: number;
  notes?: string;
  isApproved: boolean;
}

class ProductionService extends BaseApiService {
  async getById(id: string) {
    return this.get<ProductionJob>(`${API_ENDPOINTS.PRODUCTION_JOBS.BY_ID}/${id}`);
  }

  async getByStatus(status: string) {
    return this.get<ProductionJob[]>(`${API_ENDPOINTS.PRODUCTION_JOBS.BY_STATUS}/${status}`);
  }

  async getByTechnician(technicianId: string) {
    return this.get<ProductionJob[]>(`${API_ENDPOINTS.PRODUCTION_JOBS.BY_TECHNICIAN}/${technicianId}`);
  }

  async getManufacturingPool() {
    return this.get<ProductionJob[]>(`${API_ENDPOINTS.PRODUCTION_JOBS.BY_STATUS}/IN_QUEUE`);
  }

  async getMyProductionJobs() {
    return this.get<ProductionJob[]>(`${API_ENDPOINTS.PRODUCTION_JOBS.BY_STATUS}/IN_PROGRESS`);
  }

  async claim(id: string) {
    return this.post<void>(`${API_ENDPOINTS.PRODUCTION_JOBS.CLAIM}/${id}/claim`, {});
  }

  async finish(id: string, data: HandoverRequest) {
    return this.post<void>(`${API_ENDPOINTS.PRODUCTION_JOBS.FINISH}/${id}/finish`, data);
  }

  async qcReceive(id: string) {
    return this.post<void>(`${API_ENDPOINTS.PRODUCTION_JOBS.QC_RECEIVE}/${id}/qc-receive`, {});
  }

  async inspect(id: string, data: InspectionRequest) {
    return this.post<void>(`${API_ENDPOINTS.PRODUCTION_JOBS.INSPECT}/${id}/inspect`, data);
  }

  async confirmRework(id: string) {
    return this.post<void>(`${API_ENDPOINTS.PRODUCTION_JOBS.REWORK}/${id}/confirm-rework`, {});
  }
}

export const productionService = new ProductionService();
