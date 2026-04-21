export const MONTHLY_REVENUE = [
  { month: "T10", value: 18.5 },
  { month: "T11", value: 21.2 },
  { month: "T12", value: 32.8 },
  { month: "T1", value: 19.1 },
  { month: "T2", value: 22.4 },
  { month: "T3", value: 28.4 },
];

export const TOP_PRODUCTS = [
  {
    name: "Gấu Nâu Brownie",
    badge: "Toán học",
    color: "#17409A",
    sales: 84,
    image: "/teddy_bear.png",
  },
  {
    name: "Gấu Trắng Luna",
    badge: "Âm nhạc",
    color: "#7C5CFC",
    sales: 71,
    image: "/teddy_bear.png",
  },
  {
    name: "Gấu Hồng Rosie",
    badge: "Khoa học",
    color: "#4ECDC4",
    sales: 63,
    image: "/teddy_bear.png",
  },
  {
    name: "Gấu Xám Smoky",
    badge: "Lập trình",
    color: "#FF8C42",
    sales: 47,
    image: "/teddy_bear.png",
  },
];

export const RECENT_ORDERS = [
  {
    id: "ORD-047",
    customer: "Nguyễn Thanh Hoa",
    avatar: "H",
    product: "Gấu Nâu Brownie",
    amount: "450.000đ",
    status: "shipping" as const,
  },
  {
    id: "ORD-046",
    customer: "Trần Minh Khoa",
    avatar: "K",
    product: "Gấu Trắng Luna",
    amount: "520.000đ",
    status: "done" as const,
  },
  {
    id: "ORD-045",
    customer: "Lê Thị Mai Anh",
    avatar: "A",
    product: "Bộ phụ kiện",
    amount: "180.000đ",
    status: "pending" as const,
  },
  {
    id: "ORD-044",
    customer: "Phạm Văn Đức",
    avatar: "Đ",
    product: "Gấu Hồng Rosie",
    amount: "480.000đ",
    status: "done" as const,
  },
  {
    id: "ORD-043",
    customer: "Vũ Thu Hằng",
    avatar: "H",
    product: "Gấu Xám Smoky",
    amount: "390.000đ",
    status: "shipping" as const,
  },
];

export const QUICK_STATS = [
  {
    label: "Doanh thu tháng",
    value: "28.4M",
    unit: "VND",
    trend: "+8.3%",
    up: true,
    accent: "#17409A",
  },
  {
    label: "Gấu đã bán",
    value: "312",
    unit: "sp",
    trend: "+15%",
    up: true,
    accent: "#7C5CFC",
  },
  {
    label: "Khách hàng mới",
    value: "89",
    unit: "người",
    trend: "+22%",
    up: true,
    accent: "#4ECDC4",
  },
  {
    label: "Đánh giá trung bình",
    value: "4.8",
    unit: "/ 5",
    trend: "+0.1",
    up: true,
    accent: "#FFD93D",
  },
];

// ─── Analytics ───────────────────────────────────────────────────────────────

export const ANALYTICS_KPIS = [
  {
    label: "Phiên truy cập",
    value: "7,475",
    unit: "lượt",
    trend: "+18.4%",
    up: true,
    accent: "#17409A",
  },
  {
    label: "Tỷ lệ thoát",
    value: "24",
    unit: "%",
    trend: "-3.2%",
    up: true,
    accent: "#4ECDC4",
  },
  {
    label: "Giá trị đơn TB",
    value: "418K",
    unit: "VND",
    trend: "+5.2%",
    up: true,
    accent: "#7C5CFC",
  },
  {
    label: "Vòng đời KH",
    value: "2.3M",
    unit: "VND",
    trend: "+12.1%",
    up: true,
    accent: "#FF8C42",
  },
];

export const REVENUE_COMPARISON = {
  labels: ["T10", "T11", "T12", "T1", "T2", "T3"],
  thisYear: [18.5, 21.2, 32.8, 19.1, 22.4, 28.4],
  lastYear: [14.2, 16.8, 24.1, 15.3, 17.9, 22.1],
};

export const CUSTOMER_SEGMENTS = [
  { label: "4–6 tuổi", value: 32, color: "#17409A" },
  { label: "7–10 tuổi", value: 28, color: "#7C5CFC" },
  { label: "0–3 tuổi", value: 18, color: "#FF8C42" },
  { label: "10+ tuổi", value: 12, color: "#4ECDC4" },
  { label: "Quà tặng", value: 10, color: "#FFD93D" },
];

export const TRAFFIC_CHANNELS = [
  { channel: "Facebook Ads", pct: 38, sessions: 2841, color: "#17409A" },
  { channel: "TikTok Ads", pct: 27, sessions: 2018, color: "#7C5CFC" },
  { channel: "Google SEO", pct: 19, sessions: 1420, color: "#4ECDC4" },
  { channel: "Trực tiếp", pct: 11, sessions: 822, color: "#FF8C42" },
  { channel: "Giới thiệu", pct: 5, sessions: 374, color: "#FFD93D" },
];

export const GEO_DISTRIBUTION = [
  { province: "TP. Hồ Chí Minh", orders: 148, pct: 47 },
  { province: "Hà Nội", orders: 87, pct: 28 },
  { province: "Đà Nẵng", orders: 31, pct: 10 },
  { province: "Cần Thơ", orders: 19, pct: 6 },
  { province: "Hải Phòng", orders: 16, pct: 5 },
  { province: "Khác", orders: 11, pct: 4 },
];

export const PRODUCT_MIX = [
  { label: "Gấu hoàn chỉnh", value: 52, color: "#17409A" },
  { label: "Thân gấu", value: 27, color: "#7C5CFC" },
  { label: "Phụ kiện", value: 21, color: "#4ECDC4" },
];

/** 7 ngày (T2..CN) × 24 giờ: 0=trống, 1=thấp, 2=vừa, 3=cao */
export const HOURLY_HEATMAP: number[][] = [
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 3, 2, 2, 1, 2, 1, 1, 1, 2, 3, 2, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 3, 2, 1, 1, 2, 1, 1, 2, 3, 3, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 3, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 1, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1, 2, 3, 2, 2, 1, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 2, 3, 2, 3, 2, 2, 2, 2, 2, 2, 3, 3, 3, 2, 1, 0],
  [0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 3, 3, 2, 2, 3, 3, 2, 2, 3, 3, 2, 1, 0],
  [0, 0, 0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 1, 0],
];

// ─── Orders ──────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "pending"
  | "packing"
  | "shipping"
  | "done"
  | "cancelled";

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
  {
    id: "ORD-047",
    customer: "Nguyễn Thanh Hoa",
    avatar: "H",
    product: "Gấu Nâu Brownie",
    badge: "Toán",
    badgeColor: "#17409A",
    amount: 450000,
    status: "shipping",
    date: "07/03",
    time: "09:14",
    city: "TP.HCM",
  },
  {
    id: "ORD-046",
    customer: "Trần Minh Khoa",
    avatar: "K",
    product: "Gấu Trắng Luna",
    badge: "Âm nhạc",
    badgeColor: "#FF6B9D",
    amount: 520000,
    status: "done",
    date: "07/03",
    time: "08:32",
    city: "Hà Nội",
  },
  {
    id: "ORD-045",
    customer: "Lê Thị Mai Anh",
    avatar: "A",
    product: "Bộ váy Công chúa",
    badge: "Phụ kiện",
    badgeColor: "#FF8C42",
    amount: 185000,
    status: "pending",
    date: "07/03",
    time: "07:55",
    city: "Đà Nẵng",
  },
  {
    id: "ORD-044",
    customer: "Phạm Văn Đức",
    avatar: "Đ",
    product: "Gấu Hồng Rosie",
    badge: "Khoa học",
    badgeColor: "#4ECDC4",
    amount: 480000,
    status: "done",
    date: "06/03",
    time: "22:18",
    city: "TP.HCM",
  },
  {
    id: "ORD-043",
    customer: "Vũ Thu Hằng",
    avatar: "H",
    product: "Gấu Xám Smoky",
    badge: "Lập trình",
    badgeColor: "#7C5CFC",
    amount: 390000,
    status: "shipping",
    date: "06/03",
    time: "20:41",
    city: "Cần Thơ",
  },
  {
    id: "ORD-042",
    customer: "Đỗ Quang Huy",
    avatar: "H",
    product: "Gấu Tím Genius",
    badge: "Lập trình",
    badgeColor: "#7C5CFC",
    amount: 620000,
    status: "packing",
    date: "06/03",
    time: "18:05",
    city: "Hải Phòng",
  },
  {
    id: "ORD-041",
    customer: "Bùi Lan Phương",
    avatar: "P",
    product: "Gấu Kem Storyteller",
    badge: "Ngôn ngữ",
    badgeColor: "#7C5CFC",
    amount: 490000,
    status: "done",
    date: "06/03",
    time: "15:30",
    city: "Hà Nội",
  },
  {
    id: "ORD-040",
    customer: "Hoàng Minh Tuấn",
    avatar: "T",
    product: "Gấu Vàng Sunny",
    badge: undefined,
    badgeColor: "#FFD93D",
    amount: 380000,
    status: "cancelled",
    date: "06/03",
    time: "11:22",
    city: "TP.HCM",
  },
  {
    id: "ORD-039",
    customer: "Ngô Thị Kim Anh",
    avatar: "A",
    product: "Gấu Xanh Einstein",
    badge: "Khoa học",
    badgeColor: "#4ECDC4",
    amount: 580000,
    status: "shipping",
    date: "05/03",
    time: "19:48",
    city: "Hà Nội",
  },
  {
    id: "ORD-038",
    customer: "Trương Quốc Bảo",
    avatar: "B",
    product: "Gấu Nâu Brownie",
    badge: "Toán",
    badgeColor: "#17409A",
    amount: 450000,
    status: "done",
    date: "05/03",
    time: "14:12",
    city: "TP.HCM",
  },
  {
    id: "ORD-037",
    customer: "Đinh Thùy Dung",
    avatar: "D",
    product: "Bộ váy Công chúa",
    badge: "Phụ kiện",
    badgeColor: "#FF8C42",
    amount: 185000,
    status: "packing",
    date: "05/03",
    time: "10:55",
    city: "Đà Nẵng",
  },
  {
    id: "ORD-036",
    customer: "Lý Hoàng Long",
    avatar: "L",
    product: "Gấu Trắng Luna",
    badge: "Âm nhạc",
    badgeColor: "#FF6B9D",
    amount: 520000,
    status: "pending",
    date: "05/03",
    time: "09:30",
    city: "Cần Thơ",
  },
];

export const ORDER_PIPELINE = [
  { label: "Chờ xử lý", count: 9, color: "#FF8C42" },
  { label: "Đóng gói", count: 14, color: "#7C5CFC" },
  { label: "Vận chuyển", count: 21, color: "#17409A" },
  { label: "Hoàn thành", count: 312, color: "#4ECDC4" },
  { label: "Đã hủy", count: 8, color: "#FF6B9D" },
];

/** Orders last 7 days: Mon → Sun */
export const ORDERS_LAST_7 = [32, 38, 41, 29, 45, 36, 47];

// ─── Products Admin ───────────────────────────────────────────────────────────

export type ProductAdminStatus = "active" | "draft" | "archived";

export interface ProductAdmin {
  id: string;
  name: string;
  imageUrl: string;
  badge?: string;
  badgeColor: string;
  category: "complete" | "bear" | "accessory";
  price: number;
  priceRange?: string | null;
  stock: number;
  sold: number;
  rating: number;
  status: ProductAdminStatus;
  popular: boolean;
}

export const PRODUCTS_ADMIN: ProductAdmin[] = [
  {
    id: "bear-brown-happy",
    name: "Gấu Nâu Dudu Hạnh Phúc",
    imageUrl: "/teddy_bear.png",
    badge: "Toán",
    badgeColor: "#17409A",
    category: "complete",
    price: 450000,
    stock: 38,
    sold: 84,
    rating: 4.9,
    status: "active",
    popular: true,
  },
  {
    id: "bear-pink-melody",
    name: "Gấu Trắng Bubu Âm Nhạc",
    imageUrl: "/teddy_bear.png",
    badge: "Âm nhạc",
    badgeColor: "#FF6B9D",
    category: "complete",
    price: 520000,
    stock: 24,
    sold: 71,
    rating: 4.8,
    status: "active",
    popular: true,
  },
  {
    id: "bear-blue-einstein",
    name: "Gấu Xanh Einstein Khám Phá",
    imageUrl: "/teddy_bear.png",
    badge: "Khoa học",
    badgeColor: "#4ECDC4",
    category: "complete",
    price: 580000,
    stock: 51,
    sold: 63,
    rating: 4.7,
    status: "active",
    popular: false,
  },
  {
    id: "bear-cream-story",
    name: "Gấu Kem Storyteller Kể Chuyện",
    imageUrl: "/teddy_bear.png",
    badge: "Ngôn ngữ",
    badgeColor: "#7C5CFC",
    category: "complete",
    price: 490000,
    stock: 19,
    sold: 58,
    rating: 4.8,
    status: "active",
    popular: true,
  },
  {
    id: "bear-white-picasso",
    name: "Gấu Trắng Picasso Nghệ Sĩ",
    imageUrl: "/teddy_bear.png",
    badge: "Nghệ thuật",
    badgeColor: "#FF8C42",
    category: "bear",
    price: 460000,
    stock: 12,
    sold: 42,
    rating: 4.6,
    status: "active",
    popular: false,
  },
  {
    id: "bear-yellow-sunny",
    name: "Gấu Vàng Sunny Bạn Đồng Hành",
    imageUrl: "/teddy_bear.png",
    badge: "Gấu bông",
    badgeColor: "#FFD93D",
    category: "bear",
    price: 380000,
    stock: 6,
    sold: 35,
    rating: 4.5,
    status: "active",
    popular: false,
  },
  {
    id: "bear-purple-genius",
    name: "Gấu Tím Genius Lập Trình",
    imageUrl: "/teddy_bear.png",
    badge: "Lập trình",
    badgeColor: "#7C5CFC",
    category: "bear",
    price: 620000,
    stock: 29,
    sold: 47,
    rating: 4.9,
    status: "active",
    popular: true,
  },
  {
    id: "outfit-princess",
    name: "Bộ Váy Công Chúa Hoàng Gia",
    imageUrl: "/teddy_bear.png",
    badge: "Phụ kiện",
    badgeColor: "#FF8C42",
    category: "accessory",
    price: 185000,
    stock: 73,
    sold: 31,
    rating: 4.4,
    status: "active",
    popular: false,
  },
  {
    id: "outfit-space",
    name: "Đồ Phi Hành Gia Vũ Trụ",
    imageUrl: "/teddy_bear.png",
    badge: "Phụ kiện",
    badgeColor: "#FF6B9D",
    category: "accessory",
    price: 210000,
    stock: 0,
    sold: 29,
    rating: 4.6,
    status: "archived",
    popular: true,
  },
  {
    id: "bear-red-dragon",
    name: "Gấu Đỏ Dragon Dũng Cảm",
    imageUrl: "/teddy_bear.png",
    badge: "Thể thao",
    badgeColor: "#FF6B9D",
    category: "bear",
    price: 540000,
    stock: 0,
    sold: 0,
    rating: 0,
    status: "draft",
    popular: false,
  },
  {
    id: "outfit-dino",
    name: "Trang Phục Khủng Long Xanh",
    imageUrl: "/teddy_bear.png",
    badge: "Phụ kiện",
    badgeColor: "#4ECDC4",
    category: "accessory",
    price: 195000,
    stock: 0,
    sold: 0,
    rating: 0,
    status: "draft",
    popular: false,
  },
];

export const PRODUCT_CATEGORY_STATS = [
  {
    key: "complete",
    label: "Gấu hoàn chỉnh",
    count: 4,
    sold: 276,
    color: "#17409A",
  },
  { key: "bear", label: "Thân gấu", count: 4, sold: 124, color: "#7C5CFC" },
  { key: "accessory", label: "Phụ kiện", count: 3, sold: 60, color: "#FF8C42" },
];

// ─────────────────────────────────────────────────────
// CUSTOMERS
// ─────────────────────────────────────────────────────
export type CustomerStatus = "vip" | "active" | "new" | "inactive";
export type CustomerTier = "diamond" | "gold" | "silver" | "bronze";

export interface CustomerRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string; // initials
  avatarColor: string;
  totalOrders: number;
  totalSpent: number; // VND
  lastOrder: string;
  joinDate: string;
  status: CustomerStatus;
  tier: CustomerTier;
  favoriteProduct: string;
}

export const CUSTOMERS: CustomerRow[] = [
  {
    id: "CUS-001",
    name: "Nguyễn Thanh Hoa",
    email: "hoa.nguyen@gmail.com",
    phone: "0901 234 567",
    avatar: "H",
    avatarColor: "#FF6B9D",
    totalOrders: 12,
    totalSpent: 5_400_000,
    lastOrder: "02/03/2026",
    joinDate: "10/08/2024",
    status: "vip",
    tier: "diamond",
    favoriteProduct: "Gấu Nâu Dudu",
  },
  {
    id: "CUS-002",
    name: "Trần Minh Khoa",
    email: "khoa.tran@gmail.com",
    phone: "0912 345 678",
    avatar: "K",
    avatarColor: "#17409A",
    totalOrders: 8,
    totalSpent: 3_680_000,
    lastOrder: "27/02/2026",
    joinDate: "15/11/2024",
    status: "vip",
    tier: "diamond",
    favoriteProduct: "Gấu Trắng Luna",
  },
  {
    id: "CUS-003",
    name: "Lê Thị Mai Anh",
    email: "maianh.le@gmail.com",
    phone: "0987 654 321",
    avatar: "A",
    avatarColor: "#4ECDC4",
    totalOrders: 7,
    totalSpent: 2_940_000,
    lastOrder: "01/03/2026",
    joinDate: "22/01/2025",
    status: "vip",
    tier: "gold",
    favoriteProduct: "Bộ Váy Công Chúa",
  },
  {
    id: "CUS-004",
    name: "Phạm Văn Đức",
    email: "duc.pham@outlook.com",
    phone: "0978 123 456",
    avatar: "Đ",
    avatarColor: "#7C5CFC",
    totalOrders: 6,
    totalSpent: 2_310_000,
    lastOrder: "28/02/2026",
    joinDate: "05/03/2025",
    status: "vip",
    tier: "gold",
    favoriteProduct: "Gấu Hồng Rosie",
  },
  {
    id: "CUS-005",
    name: "Vũ Thu Hằng",
    email: "hang.vu@gmail.com",
    phone: "0965 432 198",
    avatar: "H",
    avatarColor: "#FF8C42",
    totalOrders: 5,
    totalSpent: 1_750_000,
    lastOrder: "03/03/2026",
    joinDate: "18/04/2025",
    status: "active",
    tier: "silver",
    favoriteProduct: "Gấu Xám Smoky",
  },
  {
    id: "CUS-006",
    name: "Ngô Bảo Châu",
    email: "chau.ngo@gmail.com",
    phone: "0933 876 543",
    avatar: "C",
    avatarColor: "#FFD93D",
    totalOrders: 4,
    totalSpent: 1_480_000,
    lastOrder: "24/02/2026",
    joinDate: "09/06/2025",
    status: "active",
    tier: "silver",
    favoriteProduct: "Gấu Tím Genius",
  },
  {
    id: "CUS-007",
    name: "Đinh Xuân Trường",
    email: "truong.dinh@gmail.com",
    phone: "0944 765 432",
    avatar: "T",
    avatarColor: "#4ECDC4",
    totalOrders: 3,
    totalSpent: 1_020_000,
    lastOrder: "20/02/2026",
    joinDate: "30/07/2025",
    status: "active",
    tier: "silver",
    favoriteProduct: "Gấu Xanh Einstein",
  },
  {
    id: "CUS-008",
    name: "Hoàng Mỹ Linh",
    email: "linh.hoang@gmail.com",
    phone: "0956 321 987",
    avatar: "L",
    avatarColor: "#FF6B9D",
    totalOrders: 3,
    totalSpent: 930_000,
    lastOrder: "15/02/2026",
    joinDate: "11/08/2025",
    status: "active",
    tier: "bronze",
    favoriteProduct: "Đồ Phi Hành Gia",
  },
  {
    id: "CUS-009",
    name: "Bùi Quang Minh",
    email: "minh.bui@yahoo.com",
    phone: "0923 654 789",
    avatar: "M",
    avatarColor: "#17409A",
    totalOrders: 2,
    totalSpent: 720_000,
    lastOrder: "10/02/2026",
    joinDate: "22/09/2025",
    status: "active",
    tier: "bronze",
    favoriteProduct: "Trang Phục Khủng Long",
  },
  {
    id: "CUS-010",
    name: "Trịnh Khánh Ly",
    email: "ly.trinh@gmail.com",
    phone: "0981 234 567",
    avatar: "L",
    avatarColor: "#7C5CFC",
    totalOrders: 1,
    totalSpent: 450_000,
    lastOrder: "04/03/2026",
    joinDate: "01/02/2026",
    status: "new",
    tier: "bronze",
    favoriteProduct: "Gấu Nâu Dudu",
  },
  {
    id: "CUS-011",
    name: "Cao Thị Thanh Tâm",
    email: "tam.cao@gmail.com",
    phone: "0908 765 234",
    avatar: "T",
    avatarColor: "#FF8C42",
    totalOrders: 1,
    totalSpent: 520_000,
    lastOrder: "02/03/2026",
    joinDate: "15/02/2026",
    status: "new",
    tier: "bronze",
    favoriteProduct: "Gấu Trắng Luna",
  },
  {
    id: "CUS-012",
    name: "Phan Đức Anh",
    email: "ducanh.phan@gmail.com",
    phone: "0971 098 765",
    avatar: "A",
    avatarColor: "#4ECDC4",
    totalOrders: 1,
    totalSpent: 185_000,
    lastOrder: "05/03/2026",
    joinDate: "28/02/2026",
    status: "new",
    tier: "bronze",
    favoriteProduct: "Bộ Váy Công Chúa",
  },
  {
    id: "CUS-013",
    name: "Lương Thị Nga",
    email: "nga.luong@outlook.com",
    phone: "0934 567 890",
    avatar: "N",
    avatarColor: "#FFD93D",
    totalOrders: 2,
    totalSpent: 680_000,
    lastOrder: "10/01/2026",
    joinDate: "14/05/2025",
    status: "inactive",
    tier: "bronze",
    favoriteProduct: "Gấu Tím Genius",
  },
  {
    id: "CUS-014",
    name: "Đặng Văn Hùng",
    email: "hung.dang@gmail.com",
    phone: "0947 890 123",
    avatar: "H",
    avatarColor: "#FF6B9D",
    totalOrders: 3,
    totalSpent: 1_140_000,
    lastOrder: "05/12/2025",
    joinDate: "20/03/2025",
    status: "inactive",
    tier: "silver",
    favoriteProduct: "Gấu Hồng Rosie",
  },
];

export const CUSTOMER_MONTHLY = [
  { month: "T10", value: 23 },
  { month: "T11", value: 31 },
  { month: "T12", value: 47 },
  { month: "T1", value: 28 },
  { month: "T2", value: 35 },
  { month: "T3", value: 42 },
];

export const CUSTOMER_TIER_STATS = [
  { tier: "Diamond VIP", count: 47, color: "#7C5CFC" },
  { tier: "Gold", count: 89, color: "#FFD93D" },
  { tier: "Silver", count: 124, color: "#4ECDC4" },
  { tier: "Bronze", count: 56, color: "#FF8C42" },
];

// ─── Reviews ─────────────────────────────────────────────────────────────────

export type ReviewStatus = "published" | "pending" | "flagged" | "hidden";

export interface AdminReview {
  id: string;
  customer: string;
  avatar: string; // initials
  avatarColor: string;
  product: string;
  productId: string;
  rating: number; // 1–5
  title: string;
  content: string;
  date: string;
  status: ReviewStatus;
  helpful: number;
  reply?: string;
}

export const ADMIN_REVIEWS: AdminReview[] = [
  {
    id: "RV-001",
    customer: "Nguyễn Thanh Hoa",
    avatar: "H",
    avatarColor: "#FF6B9D",
    product: "Gấu Nâu Dudu Hạnh Phúc",
    productId: "bear-brown-happy",
    rating: 5,
    title: "Bé yêu thích lắm, chất lượng rất tốt!",
    content:
      "Mình mua tặng sinh nhật con gái 5 tuổi, bé thích mê. Chất liệu bông mềm mại, không bị dị ứng. Gấu có thể nói chuyện được theo chủ đề Toán học, rất thú vị. Shop giao hàng nhanh, đóng gói cẩn thận. Sẽ mua thêm cho con.",
    date: "03/03/2026",
    status: "published",
    helpful: 24,
    reply:
      "Cảm ơn chị Hoa đã tin tưởng Design a Bear! Bé nhà chị học cùng Dudu nhé 🐻",
  },
  {
    id: "RV-002",
    customer: "Trần Minh Khoa",
    avatar: "K",
    avatarColor: "#17409A",
    product: "Gấu Trắng Bubu Âm Nhạc",
    productId: "bear-pink-melody",
    rating: 5,
    title: "Sản phẩm tuyệt vời, thiết kế cực đáng yêu",
    content:
      "Gấu trắng xinh xắn, phần âm nhạc của gấu rất hay và đa dạng. Con trai mình 4 tuổi học được nhiều bài hát thiếu nhi. Pin bền, dùng được mấy tuần mới cần thay. Rất recommend cho các phụ huynh.",
    date: "27/02/2026",
    status: "published",
    helpful: 18,
  },
  {
    id: "RV-003",
    customer: "Lê Thị Mai Anh",
    avatar: "A",
    avatarColor: "#4ECDC4",
    product: "Bộ Váy Công Chúa Hoàng Gia",
    productId: "outfit-princess",
    rating: 4,
    title: "Váy đẹp nhưng size hơi nhỏ",
    content:
      "Chất liệu vải đẹp, màu sắc rực rỡ đúng như ảnh. Tuy nhiên size váy hơi nhỏ hơn mình tưởng, may là gấu nhà mình vừa vặn. Nếu bạn có gấu to hơn một chút thì nên liên hệ shop trước khi mua.",
    date: "01/03/2026",
    status: "published",
    helpful: 11,
    reply:
      "Cảm ơn chị đã góp ý! Shop sẽ cập nhật thông tin size chi tiết hơn. Nếu cần chị inbox nhé ạ!",
  },
  {
    id: "RV-004",
    customer: "Phạm Văn Đức",
    avatar: "Đ",
    avatarColor: "#7C5CFC",
    product: "Gấu Tím Genius Lập Trình",
    productId: "bear-purple-genius",
    rating: 5,
    title: "Con trai mình mê lập trình từ năm 4 tuổi nhờ gấu này",
    content:
      "Thực sự ấn tượng với nội dung giáo dục. Gấu dạy tư duy logic theo kiểu game rất thú vị. Con tôi hỏi về lập trình mỗi ngày kể từ khi có gấu. Đây là khoản đầu tư xứng đáng cho tương lai của bé.",
    date: "28/02/2026",
    status: "published",
    helpful: 31,
  },
  {
    id: "RV-005",
    customer: "Vũ Thu Hằng",
    avatar: "H",
    avatarColor: "#FF8C42",
    product: "Gấu Xám Smoky",
    productId: "bear-grey-smoky",
    rating: 3,
    title: "Bình thường, không có gì đặc biệt lắm",
    content:
      "Gấu trông ổn, chất lượng may vá tốt nhưng tính năng giáo dục không nổi bật bằng các dòng khác. Có thể do mình kỳ vọng quá cao. Bé nhà mình thích nhưng không mê như mình mong đợi.",
    date: "03/03/2026",
    status: "published",
    helpful: 5,
  },
  {
    id: "RV-006",
    customer: "Ngô Bảo Châu",
    avatar: "C",
    avatarColor: "#FFD93D",
    product: "Gấu Xanh Einstein Khám Phá",
    productId: "bear-blue-einstein",
    rating: 5,
    title: "Giáo dục khoa học mà vẫn vui!",
    content:
      "Shop tư vấn rất nhiệt tình. Gấu Einstein dạy về vũ trụ, động vật, thực vật một cách sinh động. Mình thấy con học được nhiều kiến thức bổ ích mà vẫn thích chơi. Sẽ tiếp tục ủng hộ thương hiệu.",
    date: "24/02/2026",
    status: "published",
    helpful: 22,
  },
  {
    id: "RV-007",
    customer: "Đinh Xuân Trường",
    avatar: "T",
    avatarColor: "#4ECDC4",
    product: "Gấu Kem Storyteller Kể Chuyện",
    productId: "bear-cream-story",
    rating: 4,
    title: "Kể chuyện hay, con ngủ ngon hơn",
    content:
      "Tính năng kể chuyện buổi tối rất tuyệt. Gấu có nhiều câu chuyện, giọng đọc dễ nghe, không bị chói. Con bé 3 tuổi nhà mình ngủ ngon hơn hẳn từ khi có gấu này. Trừ 1 sao vì app kết nối đôi khi lag.",
    date: "20/02/2026",
    status: "published",
    helpful: 15,
  },
  {
    id: "RV-008",
    customer: "Hoàng Mỹ Linh",
    avatar: "L",
    avatarColor: "#FF6B9D",
    product: "Đồ Phi Hành Gia Vũ Trụ",
    productId: "outfit-space",
    rating: 2,
    title: "Đường may không đẹp lắm",
    content:
      "Nhìn ảnh thì đẹp nhưng khi nhận hàng thấy một số đường may không thẳng. Màu sắc cũng nhạt hơn ảnh. Mình không hài lòng lắm với chất lượng lần này. Mong shop cải thiện khâu kiểm tra hàng.",
    date: "15/02/2026",
    status: "flagged",
    helpful: 3,
  },
  {
    id: "RV-009",
    customer: "Bùi Quang Minh",
    avatar: "M",
    avatarColor: "#17409A",
    product: "Trang Phục Khủng Long Xanh",
    productId: "outfit-dino",
    rating: 5,
    title: "Siêu cute! Con bé phát cuồng luôn",
    content:
      "Trang phục khủng long xanh may rất tỉ mỉ, màu sắc tươi sáng đẹp mắt. Có âm thanh tiếng khủng long nữa, con bé cười ngặt nghẽo. Ship nhanh, hộp quà đẹp. Mua làm quà sinh nhật bạn thân rất ổn!",
    date: "10/02/2026",
    status: "pending",
    helpful: 0,
  },
  {
    id: "RV-010",
    customer: "Trịnh Khánh Ly",
    avatar: "L",
    avatarColor: "#7C5CFC",
    product: "Gấu Nâu Dudu Hạnh Phúc",
    productId: "bear-brown-happy",
    rating: 5,
    title: "Mua lần 2 vì bé yêu quá cần thêm 1 con",
    content:
      "Mua lần đầu bé thích quá nên đặt thêm 1 con nữa phòng khi con cũ bị bẩn thì có cái thay. Chất lượng đồng đều, không bị khác màu. Shop vẫn giữ price point tốt. Rất hài lòng!",
    date: "04/03/2026",
    status: "pending",
    helpful: 0,
  },
  {
    id: "RV-011",
    customer: "Đặng Văn Hùng",
    avatar: "H",
    avatarColor: "#FF6B9D",
    product: "Gấu Hồng Rosie",
    productId: "bear-pink-rosie",
    rating: 1,
    title: "Gấu bị lỗi âm thanh từ ngày đầu",
    content:
      "Nhận hàng xong bật lên thì âm thanh bị rè và ngắt quãng. Liên hệ shop mấy ngày chưa được phản hồi. Bé thất vọng lắm vì chờ mãi mới có. Mong shop giải quyết sớm và cải thiện QC tốt hơn.",
    date: "05/12/2025",
    status: "flagged",
    helpful: 7,
  },
  {
    id: "RV-012",
    customer: "Lương Thị Nga",
    avatar: "N",
    avatarColor: "#FFD93D",
    product: "Gấu Vàng Sunny Bạn Đồng Hành",
    productId: "bear-yellow-sunny",
    rating: 4,
    title: "Đáng tiền, bé chơi rất vui",
    content:
      "Gấu vàng mềm mại, bé ôm ngủ rất thích. Tính năng kể chuyện và hát bài đơn giản phù hợp bé 2 tuổi. Giao hàng đúng hẹn. Nếu có thêm nội dung cập nhật được thì sẽ 5 sao.",
    date: "10/01/2026",
    status: "hidden",
    helpful: 8,
  },
];

export const REVIEW_RATING_DIST = [
  { stars: 5, count: 7, pct: 58 },
  { stars: 4, count: 3, pct: 25 },
  { stars: 3, count: 1, pct: 8 },
  { stars: 2, count: 1, pct: 8 },
  { stars: 1, count: 1, pct: 8 },
];
