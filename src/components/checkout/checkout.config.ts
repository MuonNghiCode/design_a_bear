import { z } from "zod";

export const FREE_SHIP = 500_000;

export const STEPS = [
  { id: 1, label: "Giao hàng", sub: "Địa chỉ nhận" },
  { id: 2, label: "Thanh toán", sub: "Phương thức" },
  { id: 3, label: "Xác nhận", sub: "Hoàn tất" },
];

export const deliverySchema = z.object({
  name: z.string().min(2, "Họ tên ít nhất 2 ký tự"),
  phone: z.string().regex(/^0[0-9]{9}$/, "Số điện thoại không hợp lệ"),
  email: z
    .string()
    .refine((v) => v === "" || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), {
      message: "Email không hợp lệ",
    }),
  province: z.string().min(1, "Vui lòng chọn tỉnh / thành"),
  district: z.string().min(1, "Vui lòng chọn quận / huyện"),
  ward: z.string().min(1, "Vui lòng chọn phường / xã"),
  address: z.string().min(5, "Địa chỉ ít nhất 5 ký tự"),
});
