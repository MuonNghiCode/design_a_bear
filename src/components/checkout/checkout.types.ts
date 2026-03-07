import type { ComponentType } from "react";

export interface DeliveryForm {
  name: string;
  phone: string;
  email: string;
  province: string;
  provinceName: string;
  district: string;
  districtName: string;
  ward: string;
  wardName: string;
  address: string;
  note: string;
}

export interface PaymentOption {
  id: string;
  label: string;
  brief: string;
  color: string;
  bg: string;
  Icon: ComponentType<{ size?: number }>;
}
