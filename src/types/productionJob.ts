export type ProductionStatus = "IN_QUEUE" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED" | "FINISHED" | "AWAITING_QC" | "REWORK_REQUIRED";
export type ProductionPartType = "ESP_CORE" | "PLUSH_SHELL";

export interface BuildComponentResponse {
  componentId: string;
  name: string;
  imageUrl?: string;
  type?: string;
  quantity: number;
}

export interface ProductionJob {
  jobId: string;
  orderItemId: string;
  status: ProductionStatus;
  qcStatus?: ProductionStatus;
  hasSmartChip: boolean;
  assignedUser?: string;
  startedAt?: string;
  completedAt?: string;
  serialNumber?: string;
  rejectionReason?: string;
  
  // Part specific fields
  espTechnicianId?: string;
  espStatus: ProductionStatus;
  espFinishedAt?: string;
  espHandoverPhotoUrls?: string;
  espHandoverNote?: string;

  shellTechnicianId?: string;
  shellStatus: ProductionStatus;
  shellFinishedAt?: string;
  shellHandoverPhotoUrls?: string;
  shellHandoverNote?: string;
  qcHandoverNote?: string;

  // Extra info for UI
  productName?: string;
  baseProductName?: string;
  buildName?: string;
  imageUrl?: string;
  size?: string;
  sizeTag?: string;
  weightGram: number;
  technicianName?: string;
  
  totalAssemblyCost: number;
  craftsmanCommission: number;
  qcCommission: number;
  evidenceImages?: string; // JSON string or parsed object depending on use

  components: BuildComponentResponse[];
}

export interface HandoverProductionPartRequest {
  partType: ProductionPartType;
  photoUrls: string[];
  note?: string;
}

export interface UpdateProductionPartStatusRequest {
  partType: ProductionPartType;
  status: ProductionStatus;
}

export interface SubmitInspectionRequest {
  score: number;
  notes?: string;
  isApproved: boolean;
  rejectedPartType?: string;
}
