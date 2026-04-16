import { ApiResponse } from "./responses";

export interface CalculateShippingFeeRequest {
  cartId: string;
  addressId: string;
  transport?: string;
}

export interface ShippingFeeDetail {
  name: string;
  fee: number;
  insurance_fee: number;
  delivery: boolean;
  include_vat: number;
  cost_id: string;
}

export interface ShippingFeeResponseData {
  success: boolean;
  message: string;
  fee: ShippingFeeDetail;
  log_id: string;
  error_code: string | null;
}

export type ShippingFeeResponse = ApiResponse<ShippingFeeResponseData>;
