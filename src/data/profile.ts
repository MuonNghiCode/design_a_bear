import type { ProfileOrder, ProfileReview, ProfileStat } from "@/types/profile";

export const PROFILE_ORDERS: ProfileOrder[] = [
  {
    id: "DAB7K2MX",
    product: "Gấu Nâu Dudu Hạnh Phúc",
    image: "/teddy_bear.png",
    date: "02/03/2026",
    amount: 450000,
    status: "done",
    badge: "AI Toán",
    badgeColor: "#17409A",
  },
  {
    id: "DAB3NPTQ",
    product: "Gấu Trắng Bubu Âm Nhạc",
    image: "/teddy_bear.png",
    date: "18/02/2026",
    amount: 390000,
    status: "done",
    badge: "Âm nhạc",
    badgeColor: "#FF6B9D",
  },
  {
    id: "DABXC9R1",
    product: "Gấu Hồng Lily Ngôn Ngữ",
    image: "/teddy_bear.png",
    date: "05/02/2026",
    amount: 420000,
    status: "shipping",
    badge: "Ngôn ngữ",
    badgeColor: "#4ECDC4",
  },
];

export const PROFILE_REVIEWS: ProfileReview[] = [
  {
    product: "Gấu Nâu Dudu Hạnh Phúc",
    rating: 5,
    date: "05/03/2026",
    content:
      "Sản phẩm tuyệt vời, bé nhà mình mê lắm! Gấu nói chuyện rất tự nhiên và dạy bé rất nhiều thứ.",
  },
  {
    product: "Gấu Trắng Bubu Âm Nhạc",
    rating: 4,
    date: "22/02/2026",
    content:
      "Chất lượng tốt, giao hàng nhanh. Bé thích nghe nhạc cùng gấu mỗi tối trước khi ngủ.",
  },
];

export const PROFILE_STATS: ProfileStat[] = [
  { label: "Đơn hàng", value: "3", color: "#17409A" },
  { label: "Yêu thích", value: "7", color: "#FF6B9D" },
  { label: "Điểm tích lũy", value: "1.260", color: "#FFD93D" },
  { label: "Đánh giá", value: "2", color: "#4ECDC4" },
];

export const ORDER_STATUS_CFG: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  done: { label: "Hoàn thành", color: "#4ECDC4", bg: "#4ECDC418" },
  shipping: { label: "Vận chuyển", color: "#17409A", bg: "#17409A18" },
  pending: { label: "Chờ xử lý", color: "#FF8C42", bg: "#FF8C4218" },
};

export const ROLE_CFG: Record<
  string,
  { label: string; color: string }
> = {
  admin: { label: "Quản trị viên", color: "#FF8C42" },
  staff: { label: "Nhân viên", color: "#7C5CFC" },
  user: { label: "Thành viên", color: "#17409A" },
};

export const SECURITY_ITEMS = [
  {
    label: "Đổi mật khẩu",
    desc: "Cập nhật mật khẩu định kỳ để bảo vệ tài khoản",
    action: "Đổi ngay",
    color: "#17409A",
  },
  {
    label: "Xác thực 2 bước",
    desc: "Thêm lớp bảo mật cho tài khoản của bạn",
    action: "Bật",
    color: "#4ECDC4",
  },
];
