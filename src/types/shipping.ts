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

export interface SubmitGhtkExpressOrderProductRequest {
  name: string;
  weight: number;
  quantity: number;
  productCode?: string;
}

export interface SubmitGhtkExpressOrderRequest {
  orderId: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  customerProvince: string;
  customerDistrict: string;
  customerWard?: string;
  hamlet?: string;
  pickMoney: number;
  value?: number;
  transport?: string;
  note?: string;
  isFreeShip?: number;
  pickOption?: string;
  deliverOption?: string;
  weightOption?: string;
  products: SubmitGhtkExpressOrderProductRequest[];
}

export interface GhtkSubmitOrderResponse {
  success: boolean;
  message: string;
  order?: {
    partner_id: string;
    label: string;
    area: number;
    fee: number;
    insurance_fee: number;
    estimated_pick_time: string;
    estimated_deliver_time: string;
    products: any[];
    status_id: number;
    tracking_id: number;
    sorting_code: string;
  };
  log_id?: string;
  error_code?: string;
}

export interface GhtkTrackingStatusResponse {
  success: boolean;
  message: string;
  order?: {
    label?: string;
    partner_id?: string;
    status?: string;
    status_id?: string;
    status_text?: string;
    created?: string;
    pickup_date?: string;
    deliver_date?: string;
    customer_fullname?: string;
    customer_tel?: string;
    address?: string;
    province?: string;
    district?: string;
    ward?: string;
    ship_money?: number;
    pick_money?: number;
    reason?: string;
    action_time?: string;
  };
}
