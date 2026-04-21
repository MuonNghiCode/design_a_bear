export interface AccessoryResponse {
  accessoryId: string;
  name: string;
  sku: string;
  description?: string;
  imageUrl?: string;
  baseCost: number;
  assemblyCost: number;
  targetPrice: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccessoryRequest {
  name: string;
  sku: string;
  description?: string;
  imageUrl?: string;
  baseCost: number;
  assemblyCost: number;
  targetPrice: number;
  isActive: boolean;
}

export interface UpdateAccessoryRequest {
  name?: string;
  sku?: string;
  description?: string;
  imageUrl?: string;
  baseCost?: number;
  assemblyCost?: number;
  targetPrice?: number;
  isActive?: boolean;
}
