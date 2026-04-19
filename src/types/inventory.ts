export interface Inventory {
  locationId: string;
  productId: string;
  quantityAvailable: number;
  quantityReserved: number;
  updatedAt: string;
  location?: Location;
}

export interface Location {
  locationId: string;
  name: string;
  type: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isActive: boolean;
}

export interface InventoryAdjustmentRequest {
  locationId: string;
  productId: string;
  delta: number;
}
