export interface Inventory {
  inventoryId: string;
  locationId: string;
  identityId: string;
  isAccessory: boolean;
  onHand: number;
  reserved: number;
  updatedAt: string;
  // Computed fields from Backend
  productName?: string;
  productType?: string;
  sku?: string;
  imageUrl?: string;
  sizeTag?: string;
  sizeDescription?: string;
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
  identityId: string;
  isAccessory: boolean;
  delta: number;
}
