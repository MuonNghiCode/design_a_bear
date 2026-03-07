export const MONTHLY_REVENUE = [
  { month: "T10", value: 18.5 },
  { month: "T11", value: 21.2 },
  { month: "T12", value: 32.8 },
  { month: "T1", value: 19.1 },
  { month: "T2", value: 22.4 },
  { month: "T3", value: 28.4 },
];

export const TOP_PRODUCTS = [
  { name: "Gấu Nâu Brownie", badge: "Toán học", color: "#17409A", sales: 84 },
  { name: "Gấu Trắng Luna",  badge: "Âm nhạc",  color: "#7C5CFC", sales: 71 },
  { name: "Gấu Hồng Rosie",  badge: "Khoa học", color: "#4ECDC4", sales: 63 },
  { name: "Gấu Xám Smoky",   badge: "Lập trình",color: "#FF8C42", sales: 47 },
];

export const RECENT_ORDERS = [
  { id: "ORD-047", customer: "Nguyễn Thanh Hoa", avatar: "H", product: "Gấu Nâu Brownie", amount: "450.000đ", status: "shipping" as const },
  { id: "ORD-046", customer: "Trần Minh Khoa",   avatar: "K", product: "Gấu Trắng Luna",  amount: "520.000đ", status: "done"     as const },
  { id: "ORD-045", customer: "Lê Thị Mai Anh",   avatar: "A", product: "Bộ phụ kiện",     amount: "180.000đ", status: "pending"  as const },
  { id: "ORD-044", customer: "Phạm Văn Đức",     avatar: "Đ", product: "Gấu Hồng Rosie",  amount: "480.000đ", status: "done"     as const },
  { id: "ORD-043", customer: "Vũ Thu Hằng",      avatar: "H", product: "Gấu Xám Smoky",   amount: "390.000đ", status: "shipping" as const },
];

export const QUICK_STATS = [
  { label: "Doanh thu tháng", value: "28.4M",  unit: "VND", trend: "+8.3%",  up: true,  accent: "#17409A" },
  { label: "Gấu đã bán",      value: "312",    unit: "sp",  trend: "+15%",   up: true,  accent: "#7C5CFC" },
  { label: "Khách hàng mới",  value: "89",     unit: "người",trend: "+22%",  up: true,  accent: "#4ECDC4" },
  { label: "Đánh giá trung bình", value: "4.8",unit: "/ 5", trend: "+0.1",   up: true,  accent: "#FFD93D" },
];

// ─── Analytics ───────────────────────────────────────────────────────────────

export const ANALYTICS_KPIS = [
  { label: "Phiên truy cập",  value: "7,475", unit: "lượt", trend: "+18.4%", up: true,  accent: "#17409A" },
  { label: "Tỷ lệ thoát",     value: "24",    unit: "%",    trend: "-3.2%",  up: true,  accent: "#4ECDC4" },
  { label: "Giá trị đơn TB",  value: "418K",  unit: "VND",  trend: "+5.2%",  up: true,  accent: "#7C5CFC" },
  { label: "Vòng đời KH",     value: "2.3M",  unit: "VND",  trend: "+12.1%", up: true,  accent: "#FF8C42" },
];

export const REVENUE_COMPARISON = {
  labels:   ["T10", "T11", "T12", "T1", "T2", "T3"],
  thisYear: [18.5, 21.2, 32.8, 19.1, 22.4, 28.4],
  lastYear: [14.2, 16.8, 24.1, 15.3, 17.9, 22.1],
};

export const CUSTOMER_SEGMENTS = [
  { label: "4–6 tuổi",  value: 32, color: "#17409A" },
  { label: "7–10 tuổi", value: 28, color: "#7C5CFC" },
  { label: "0–3 tuổi",  value: 18, color: "#FF8C42" },
  { label: "10+ tuổi",  value: 12, color: "#4ECDC4" },
  { label: "Quà tặng",  value: 10, color: "#FFD93D" },
];

export const TRAFFIC_CHANNELS = [
  { channel: "Facebook Ads", pct: 38, sessions: 2841, color: "#17409A" },
  { channel: "TikTok Ads",   pct: 27, sessions: 2018, color: "#7C5CFC" },
  { channel: "Google SEO",   pct: 19, sessions: 1420, color: "#4ECDC4" },
  { channel: "Trực tiếp",    pct: 11, sessions: 822,  color: "#FF8C42" },
  { channel: "Giới thiệu",   pct: 5,  sessions: 374,  color: "#FFD93D" },
];

export const GEO_DISTRIBUTION = [
  { province: "TP. Hồ Chí Minh", orders: 148, pct: 47 },
  { province: "Hà Nội",          orders: 87,  pct: 28 },
  { province: "Đà Nẵng",         orders: 31,  pct: 10 },
  { province: "Cần Thơ",         orders: 19,  pct: 6  },
  { province: "Hải Phòng",       orders: 16,  pct: 5  },
  { province: "Khác",            orders: 11,  pct: 4  },
];

export const PRODUCT_MIX = [
  { label: "Gấu hoàn chỉnh", value: 52, color: "#17409A" },
  { label: "Thân gấu",       value: 27, color: "#7C5CFC" },
  { label: "Phụ kiện",       value: 21, color: "#4ECDC4" },
];

/** 7 ngày (T2..CN) × 24 giờ: 0=trống, 1=thấp, 2=vừa, 3=cao */
export const HOURLY_HEATMAP: number[][] = [
  [0,0,0,0,0,0,0,1,1,2,3,2,2,1,2,1,1,1,2,3,2,1,1,0],
  [0,0,0,0,0,0,0,1,2,2,2,3,2,1,1,2,1,1,2,3,3,1,0,0],
  [0,0,0,0,0,0,0,1,1,2,3,2,2,2,1,1,2,2,2,2,2,1,1,0],
  [0,0,0,0,0,0,0,1,2,2,2,2,2,1,2,1,1,1,2,3,2,2,1,0],
  [0,0,0,0,0,0,1,1,2,3,2,3,2,2,2,2,2,2,3,3,3,2,1,0],
  [0,0,0,0,0,1,1,2,2,3,3,3,3,2,2,3,3,2,2,3,3,2,1,0],
  [0,0,0,0,0,0,1,1,2,2,3,3,2,2,2,2,2,1,2,2,2,1,1,0],
];

// ─── Orders ──────────────────────────────────────────────────────────────────

export type OrderStatus = "pending" | "packing" | "shipping" | "done" | "cancelled";

export interface OrderRow {
  id: string;
  customer: string;
  avatar: string;
  product: string;
  badge?: string;
  badgeColor: string;
  amount: number;
  status: OrderStatus;
  date: string;
  time: string;
  city: string;
}

export const ORDERS: OrderRow[] = [
  { id: "ORD-047", customer: "Nguyễn Thanh Hoa", avatar: "H", product: "Gấu Nâu Brownie",      badge: "Toán",      badgeColor: "#17409A", amount: 450000, status: "shipping",  date: "07/03", time: "09:14", city: "TP.HCM"   },
  { id: "ORD-046", customer: "Trần Minh Khoa",   avatar: "K", product: "Gấu Trắng Luna",        badge: "Âm nhạc",   badgeColor: "#FF6B9D", amount: 520000, status: "done",      date: "07/03", time: "08:32", city: "Hà Nội"   },
  { id: "ORD-045", customer: "Lê Thị Mai Anh",   avatar: "A", product: "Bộ váy Công chúa",      badge: "Phụ kiện",  badgeColor: "#FF8C42", amount: 185000, status: "pending",   date: "07/03", time: "07:55", city: "Đà Nẵng"  },
  { id: "ORD-044", customer: "Phạm Văn Đức",     avatar: "Đ", product: "Gấu Hồng Rosie",        badge: "Khoa học",  badgeColor: "#4ECDC4", amount: 480000, status: "done",      date: "06/03", time: "22:18", city: "TP.HCM"   },
  { id: "ORD-043", customer: "Vũ Thu Hằng",      avatar: "H", product: "Gấu Xám Smoky",         badge: "Lập trình", badgeColor: "#7C5CFC", amount: 390000, status: "shipping",  date: "06/03", time: "20:41", city: "Cần Thơ"  },
  { id: "ORD-042", customer: "Đỗ Quang Huy",     avatar: "H", product: "Gấu Tím Genius",        badge: "Lập trình", badgeColor: "#7C5CFC", amount: 620000, status: "packing",   date: "06/03", time: "18:05", city: "Hải Phòng"},
  { id: "ORD-041", customer: "Bùi Lan Phương",   avatar: "P", product: "Gấu Kem Storyteller",   badge: "Ngôn ngữ",  badgeColor: "#7C5CFC", amount: 490000, status: "done",      date: "06/03", time: "15:30", city: "Hà Nội"   },
  { id: "ORD-040", customer: "Hoàng Minh Tuấn",  avatar: "T", product: "Gấu Vàng Sunny",        badge: undefined,   badgeColor: "#FFD93D", amount: 380000, status: "cancelled", date: "06/03", time: "11:22", city: "TP.HCM"   },
  { id: "ORD-039", customer: "Ngô Thị Kim Anh",  avatar: "A", product: "Gấu Xanh Einstein",     badge: "Khoa học",  badgeColor: "#4ECDC4", amount: 580000, status: "shipping",  date: "05/03", time: "19:48", city: "Hà Nội"   },
  { id: "ORD-038", customer: "Trương Quốc Bảo",  avatar: "B", product: "Gấu Nâu Brownie",       badge: "Toán",      badgeColor: "#17409A", amount: 450000, status: "done",      date: "05/03", time: "14:12", city: "TP.HCM"   },
  { id: "ORD-037", customer: "Đinh Thùy Dung",   avatar: "D", product: "Bộ váy Công chúa",      badge: "Phụ kiện",  badgeColor: "#FF8C42", amount: 185000, status: "packing",   date: "05/03", time: "10:55", city: "Đà Nẵng"  },
  { id: "ORD-036", customer: "Lý Hoàng Long",    avatar: "L", product: "Gấu Trắng Luna",        badge: "Âm nhạc",   badgeColor: "#FF6B9D", amount: 520000, status: "pending",   date: "05/03", time: "09:30", city: "Cần Thơ"  },
];

export const ORDER_PIPELINE = [
  { label: "Chờ xử lý",  count: 9,   color: "#FF8C42" },
  { label: "Đóng gói",   count: 14,  color: "#7C5CFC" },
  { label: "Vận chuyển", count: 21,  color: "#17409A" },
  { label: "Hoàn thành", count: 312, color: "#4ECDC4" },
  { label: "Đã hủy",     count: 8,   color: "#FF6B9D" },
];

/** Orders last 7 days: Mon → Sun */
export const ORDERS_LAST_7 = [32, 38, 41, 29, 45, 36, 47];

