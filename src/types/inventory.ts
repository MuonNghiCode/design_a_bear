export interface Inventory {
  variantId?: string | null;
  productId: string;
  locationId: string;
  locationName?: string;
  onHand: number;
  reserved: number;
  quantityAvailable: number;
  updatedAt?: string;
  location?: Location;
  sizeTag?: string;
  sizeDescription?: string;
  sku?: string;
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
  variantId?: string | null;
  delta: number;
}
