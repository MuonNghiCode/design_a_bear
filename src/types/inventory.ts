export interface Inventory {
  inventoryId: string;
  locationId: string;
  productId?: string;
  variantId?: string;
  accessoryId?: string;
  productName?: string;
  productType?: string;
  imageUrl?: string;
  onHand: number;
  reserved: number;
  sizeTag?: string;
  sizeDescription?: string;
  sku?: string;
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
  productId?: string | null;
  variantId?: string | null;
  accessoryId?: string | null;
  delta: number;
}
