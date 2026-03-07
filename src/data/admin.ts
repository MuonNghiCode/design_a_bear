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
