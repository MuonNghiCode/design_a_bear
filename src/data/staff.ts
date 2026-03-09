// ─── Staff Portal Data ────────────────────────────────────────────────────────
// Staff sees operational info only — no revenue, no analytics, no full KPIs.

// ─── Tasks ────────────────────────────────────────────────────────────────────

export type TaskType    = "pack" | "verify" | "review_reply" | "quality_check" | "restock";
export type TaskPriority = "urgent" | "normal" | "low";
export type TaskStatus   = "pending" | "in_progress" | "done";

export interface StaffTask {
  id: string;
  orderId?: string;
  customer?: string;
  product: string;
  type: TaskType;
  priority: TaskPriority;
  dueBy: string;
  status: TaskStatus;
  note?: string;
  assignedToId?: string;
  assignedToName?: string;
}

export const STAFF_TASKS: StaffTask[] = [
  { id: "T-001", orderId: "ORD-047", customer: "Nguyễn Thanh Hoa",  product: "Gấu Nâu Dudu Hạnh Phúc",      type: "pack",         priority: "urgent", dueBy: "10:00", status: "in_progress" },
  { id: "T-002", orderId: "ORD-046", customer: "Trần Minh Khoa",    product: "Gấu Trắng Bubu Âm Nhạc",      type: "pack",         priority: "urgent", dueBy: "10:30", status: "pending"     },
  { id: "T-003", orderId: "ORD-045", customer: "Lê Thị Mai Anh",    product: "Bộ Váy Công Chúa Hoàng Gia",  type: "verify",       priority: "normal", dueBy: "11:00", status: "pending"     },
  { id: "T-004", orderId: "ORD-044", customer: "Phạm Văn Đức",      product: "Gấu Hồng Rosie",               type: "pack",         priority: "normal", dueBy: "11:30", status: "pending"     },
  { id: "T-005",                                                     product: "Gấu Xám Smoky",               type: "quality_check", priority: "normal", dueBy: "12:00", status: "pending", note: "Kiểm tra lô hàng mới 20 con" },
  { id: "T-006",                                                     product: "Đánh giá RV-009",             type: "review_reply",  priority: "low",    dueBy: "13:00", status: "pending"     },
  { id: "T-007",                                                     product: "Đánh giá RV-010",             type: "review_reply",  priority: "low",    dueBy: "13:00", status: "pending"     },
  { id: "T-008",                                                     product: "Bông nhồi (5kg)",             type: "restock",       priority: "low",    dueBy: "14:00", status: "pending", note: "Kho còn ~2kg" },
  { id: "T-009", orderId: "ORD-043", customer: "Vũ Thu Hằng",       product: "Gấu Xám Smoky",               type: "pack",         priority: "normal", dueBy: "14:30", status: "done"        },
  { id: "T-010", orderId: "ORD-040", customer: "Hoàng Minh Tuấn",   product: "Gấu Vàng Sunny",              type: "verify",       priority: "normal", dueBy: "09:00", status: "done"        },
];

// ─── Reports ──────────────────────────────────────────────────────────────────

export type ShiftType    = "morning" | "afternoon" | "evening";
export type ReportType   = "shift" | "quality" | "handover" | "general";
export type ReportStatus = "draft" | "submitted" | "reviewed" | "acknowledged";
export type IssueSeverity = "low" | "medium" | "high";

export interface ReportIssue {
  id: string;
  severity: IssueSeverity;
  description: string;
  resolved: boolean;
}

export interface StaffReport {
  id: string;
  type: ReportType;
  title: string;
  staffName: string;
  staffAvatar: string;
  staffAvatarColor: string;
  date: string;
  shift: ShiftType;
  ordersProcessed: number;
  packagingDone: number;
  reviewsAnswered: number;
  issuesCount: number;
  issues: ReportIssue[];
  stockNotes: string;
  handoverNotes: string;
  generalNotes: string;
  status: ReportStatus;
  createdAt: string;
  reviewedBy?: string;
  reviewNote?: string;
}

export const STAFF_REPORTS: StaffReport[] = [
  {
    id: "RPT-012",
    type: "shift",
    title: "Báo cáo ca sáng 09/03",
    staffName: "Nhân viên Bông",
    staffAvatar: "B",
    staffAvatarColor: "#7C5CFC",
    date: "09/03/2026",
    shift: "morning",
    ordersProcessed: 8,
    packagingDone: 8,
    reviewsAnswered: 3,
    issuesCount: 1,
    issues: [
      { id: "I-001", severity: "low", description: "Tem nhãn ORD-044 bị lệch, đã dán lại", resolved: true },
    ],
    stockNotes: "Bông nhồi còn ~2kg, cần đặt thêm trước 13:00",
    handoverNotes: "Ca chiều nhận thêm 5 đơn mới. ORD-042 khách cần giao trước 18:00.",
    generalNotes: "Ca sáng hoàn thành đúng tiến độ. Không có sự cố nghiêm trọng.",
    status: "submitted",
    createdAt: "09/03/2026 09:45",
  },
  {
    id: "RPT-011",
    type: "shift",
    title: "Báo cáo ca chiều 08/03",
    staffName: "Nhân viên Bông",
    staffAvatar: "B",
    staffAvatarColor: "#7C5CFC",
    date: "08/03/2026",
    shift: "afternoon",
    ordersProcessed: 11,
    packagingDone: 10,
    reviewsAnswered: 4,
    issuesCount: 2,
    issues: [
      { id: "I-002", severity: "medium", description: "Gấu Nâu Brownie lô mới có 2 con bị lệch mắt, đã tách riêng", resolved: false },
      { id: "I-003", severity: "low",    description: "Hết hộp quà size M, dùng size L thay thế", resolved: true },
    ],
    stockNotes: "Hộp quà size M đã hết. Ruy băng vàng còn ít.",
    handoverNotes: "Ca tối xử lý tiếp ORD-042, ORD-041. 2 gấu Brownie lỗi mắt đặt ở kệ A3.",
    generalNotes: "Lô gấu Brownie mới cần kiểm tra kỹ trước khi đóng gói.",
    status: "reviewed",
    createdAt: "08/03/2026 21:55",
    reviewedBy: "Admin Gấu Bông",
    reviewNote: "Đã ghi nhận. Liên hệ nhà cung cấp về lô hàng lỗi.",
  },
  {
    id: "RPT-010",
    type: "quality",
    title: "Báo cáo kiểm tra chất lượng lô T3/2026",
    staffName: "Nhân viên Bông",
    staffAvatar: "B",
    staffAvatarColor: "#7C5CFC",
    date: "07/03/2026",
    shift: "morning",
    ordersProcessed: 0,
    packagingDone: 0,
    reviewsAnswered: 0,
    issuesCount: 3,
    issues: [
      { id: "I-004", severity: "high",   description: "6/50 gấu Brownie bị lệch mắt — không đạt tiêu chuẩn",     resolved: false },
      { id: "I-005", severity: "medium", description: "Đường may vai 3 con bị hở, cần vá lại trước khi xuất",   resolved: true  },
      { id: "I-006", severity: "low",    description: "Màu bông nhồi batch mới nhạt hơn batch cũ ~5%",          resolved: false },
    ],
    stockNotes: "Toàn bộ 50 con Brownie lô T3 đã kiểm tra. 44 con đạt, 6 con lỗi mắt.",
    handoverNotes: "6 con lỗi đặt kệ A3, chờ quyết định từ admin.",
    generalNotes: "Đề xuất kiểm tra kỹ mắt gấu ngay khi nhận hàng từ nhà cung cấp.",
    status: "acknowledged",
    createdAt: "07/03/2026 11:30",
    reviewedBy: "Admin Gấu Bông",
    reviewNote: "Chấp nhận. Đã liên hệ nhà cung cấp đổi trả 6 con lỗi.",
  },
  {
    id: "RPT-009",
    type: "shift",
    title: "Báo cáo ca tối 07/03",
    staffName: "Nhân viên Bông",
    staffAvatar: "B",
    staffAvatarColor: "#7C5CFC",
    date: "07/03/2026",
    shift: "evening",
    ordersProcessed: 9,
    packagingDone: 9,
    reviewsAnswered: 2,
    issuesCount: 0,
    issues: [],
    stockNotes: "Kho ổn định. Đã nhận thêm 20 hộp quà size M.",
    handoverNotes: "Ca sáng mai ưu tiên ORD-047, ORD-046. Khách ORD-047 nhắn muốn giao sớm.",
    generalNotes: "Ca tối thuận lợi, không phát sinh sự cố.",
    status: "reviewed",
    createdAt: "07/03/2026 22:10",
    reviewedBy: "Admin Gấu Bông",
    reviewNote: "Tốt. Đúng tiến độ.",
  },
  {
    id: "RPT-008",
    type: "handover",
    title: "Biên bản bàn giao ca 06/03",
    staffName: "Nhân viên Bông",
    staffAvatar: "B",
    staffAvatarColor: "#7C5CFC",
    date: "06/03/2026",
    shift: "afternoon",
    ordersProcessed: 12,
    packagingDone: 12,
    reviewsAnswered: 5,
    issuesCount: 1,
    issues: [
      { id: "I-007", severity: "low", description: "ORD-040 khách hủy đơn, đã hoàn lại kho", resolved: true },
    ],
    stockNotes: "Tình trạng kho bình thường. Đã kiểm đếm: 38 Brownie, 24 Bubu còn lại.",
    handoverNotes: "Bàn giao ca tối 5 đơn còn lại. Danh sách đính kèm báo cáo.",
    generalNotes: "Ca chiều đông đơn, xử lý kịp thời. Tinh thần nhóm tốt.",
    status: "acknowledged",
    createdAt: "06/03/2026 21:45",
    reviewedBy: "Admin Gấu Bông",
    reviewNote: "Ghi nhận. Cảm ơn team.",
  },
];

// ─── Shift summary stats ──────────────────────────────────────────────────────

export const STAFF_MONTHLY_STATS = [
  { month: "T10", orders: 142, reports: 31 },
  { month: "T11", orders: 168, reports: 35 },
  { month: "T12", orders: 205, reports: 43 },
  { month: "T1",  orders: 153, reports: 34 },
  { month: "T2",  orders: 178, reports: 38 },
  { month: "T3",  orders: 87,  reports: 12 },
];

export const TASK_TYPE_CFG: Record<
  TaskType,
  { label: string; color: string; bg: string }
> = {
  pack:          { label: "Đóng gói",    color: "#17409A", bg: "#17409A15" },
  verify:        { label: "Kiểm tra",    color: "#7C5CFC", bg: "#7C5CFC15" },
  review_reply:  { label: "Phản hồi",    color: "#4ECDC4", bg: "#4ECDC415" },
  quality_check: { label: "Chất lượng",  color: "#FF8C42", bg: "#FF8C4215" },
  restock:       { label: "Nhập kho",    color: "#FFD93D", bg: "#FFD93D15" },
};

export const SHIFT_CFG: Record<
  ShiftType,
  { label: string; time: string; color: string }
> = {
  morning:   { label: "Ca sáng",  time: "06:00 – 14:00", color: "#FFD93D" },
  afternoon: { label: "Ca chiều", time: "14:00 – 22:00", color: "#FF8C42" },
  evening:   { label: "Ca tối",   time: "22:00 – 06:00", color: "#7C5CFC" },
};

export const REPORT_TYPE_CFG: Record<
  ReportType,
  { label: string; color: string; bg: string }
> = {
  shift:    { label: "Báo cáo ca",      color: "#17409A", bg: "#17409A15" },
  quality:  { label: "Kiểm tra CL",     color: "#FF8C42", bg: "#FF8C4215" },
  handover: { label: "Bàn giao",        color: "#4ECDC4", bg: "#4ECDC415" },
  general:  { label: "Ghi chú chung",   color: "#7C5CFC", bg: "#7C5CFC15" },
};

export const REPORT_STATUS_CFG: Record<
  ReportStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  draft:        { label: "Nháp",        color: "#9CA3AF", bg: "#9CA3AF15", dot: "#9CA3AF" },
  submitted:    { label: "Đã nộp",      color: "#17409A", bg: "#17409A15", dot: "#17409A" },
  reviewed:     { label: "Đã xem",      color: "#FF8C42", bg: "#FF8C4215", dot: "#FF8C42" },
  acknowledged: { label: "Đã ghi nhận", color: "#4ECDC4", bg: "#4ECDC415", dot: "#4ECDC4" },
};

// ─── Staff Members ────────────────────────────────────────────────────────────

export type StaffRole = "full_time" | "part_time";

export interface StaffMember {
  id: string;
  name: string;
  initial: string;
  color: string;
  role: StaffRole;
  email: string;
  phone: string;
  preferredShifts: ShiftType[];
  joinedDate: string;
  active: boolean;
}

export const STAFF_MEMBERS: StaffMember[] = [
  {
    id: "S-001",
    name: "Nguyễn Thị Lan",
    initial: "L",
    color: "#7C5CFC",
    role: "full_time",
    email: "lan.nguyen@designabear.vn",
    phone: "0901 234 567",
    preferredShifts: ["morning", "afternoon"],
    joinedDate: "15/01/2025",
    active: true,
  },
  {
    id: "S-002",
    name: "Trần Quốc Bảo",
    initial: "B",
    color: "#4ECDC4",
    role: "full_time",
    email: "bao.tran@designabear.vn",
    phone: "0912 345 678",
    preferredShifts: ["afternoon", "evening"],
    joinedDate: "03/03/2025",
    active: true,
  },
  {
    id: "S-003",
    name: "Phạm Minh Châu",
    initial: "C",
    color: "#FF6B9D",
    role: "part_time",
    email: "chau.pham@designabear.vn",
    phone: "0923 456 789",
    preferredShifts: ["morning"],
    joinedDate: "10/06/2025",
    active: true,
  },
  {
    id: "S-004",
    name: "Lê Văn Hùng",
    initial: "H",
    color: "#FF8C42",
    role: "part_time",
    email: "hung.le@designabear.vn",
    phone: "0934 567 890",
    preferredShifts: ["evening"],
    joinedDate: "22/09/2025",
    active: false,
  },
];

// ─── Shift Assignments (week 09–15/03/2026) ───────────────────────────────────

export interface ShiftAssignment {
  id: string;
  staffId: string;
  staffName: string;
  staffInitial: string;
  staffColor: string;
  date: string;
  shift: ShiftType;
  note?: string;
}

export const SHIFT_ASSIGNMENTS: ShiftAssignment[] = [
  // Mon 09/03
  { id: "SA-001", staffId: "S-001", staffName: "Nguyễn Thị Lan", staffInitial: "L", staffColor: "#7C5CFC", date: "09/03/2026", shift: "morning"   },
  { id: "SA-002", staffId: "S-002", staffName: "Trần Quốc Bảo",  staffInitial: "B", staffColor: "#4ECDC4", date: "09/03/2026", shift: "afternoon" },
  { id: "SA-003", staffId: "S-004", staffName: "Lê Văn Hùng",    staffInitial: "H", staffColor: "#FF8C42", date: "09/03/2026", shift: "evening"   },
  // Tue 10/03
  { id: "SA-004", staffId: "S-003", staffName: "Phạm Minh Châu", staffInitial: "C", staffColor: "#FF6B9D", date: "10/03/2026", shift: "morning"   },
  { id: "SA-005", staffId: "S-001", staffName: "Nguyễn Thị Lan", staffInitial: "L", staffColor: "#7C5CFC", date: "10/03/2026", shift: "afternoon" },
  { id: "SA-006", staffId: "S-002", staffName: "Trần Quốc Bảo",  staffInitial: "B", staffColor: "#4ECDC4", date: "10/03/2026", shift: "evening"   },
  // Wed 11/03
  { id: "SA-007", staffId: "S-001", staffName: "Nguyễn Thị Lan", staffInitial: "L", staffColor: "#7C5CFC", date: "11/03/2026", shift: "morning"   },
  { id: "SA-008", staffId: "S-003", staffName: "Phạm Minh Châu", staffInitial: "C", staffColor: "#FF6B9D", date: "11/03/2026", shift: "afternoon" },
  { id: "SA-009", staffId: "S-004", staffName: "Lê Văn Hùng",    staffInitial: "H", staffColor: "#FF8C42", date: "11/03/2026", shift: "evening"   },
  // Thu 12/03
  { id: "SA-010", staffId: "S-002", staffName: "Trần Quốc Bảo",  staffInitial: "B", staffColor: "#4ECDC4", date: "12/03/2026", shift: "morning"   },
  { id: "SA-011", staffId: "S-001", staffName: "Nguyễn Thị Lan", staffInitial: "L", staffColor: "#7C5CFC", date: "12/03/2026", shift: "afternoon" },
  { id: "SA-012", staffId: "S-004", staffName: "Lê Văn Hùng",    staffInitial: "H", staffColor: "#FF8C42", date: "12/03/2026", shift: "evening"   },
  // Fri 13/03
  { id: "SA-013", staffId: "S-002", staffName: "Trần Quốc Bảo",  staffInitial: "B", staffColor: "#4ECDC4", date: "13/03/2026", shift: "morning"   },
  { id: "SA-014", staffId: "S-003", staffName: "Phạm Minh Châu", staffInitial: "C", staffColor: "#FF6B9D", date: "13/03/2026", shift: "afternoon" },
  { id: "SA-015", staffId: "S-004", staffName: "Lê Văn Hùng",    staffInitial: "H", staffColor: "#FF8C42", date: "13/03/2026", shift: "evening"   },
  // Sat 14/03
  { id: "SA-016", staffId: "S-001", staffName: "Nguyễn Thị Lan", staffInitial: "L", staffColor: "#7C5CFC", date: "14/03/2026", shift: "morning"   },
  { id: "SA-017", staffId: "S-004", staffName: "Lê Văn Hùng",    staffInitial: "H", staffColor: "#FF8C42", date: "14/03/2026", shift: "afternoon" },
  // Sun 15/03
  { id: "SA-018", staffId: "S-003", staffName: "Phạm Minh Châu", staffInitial: "C", staffColor: "#FF6B9D", date: "15/03/2026", shift: "morning"   },
  { id: "SA-019", staffId: "S-002", staffName: "Trần Quốc Bảo",  staffInitial: "B", staffColor: "#4ECDC4", date: "15/03/2026", shift: "evening"   },
];
