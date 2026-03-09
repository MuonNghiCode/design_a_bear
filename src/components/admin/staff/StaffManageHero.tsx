import { MdGroups, MdAssignment, MdSchedule, MdTaskAlt } from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";
import {
  STAFF_MEMBERS,
  STAFF_REPORTS,
  STAFF_TASKS,
  SHIFT_ASSIGNMENTS,
} from "@/data/staff";

const today = "09/03/2026";
const submittedCount = STAFF_REPORTS.filter(
  (r) => r.status === "submitted",
).length;
const todayShiftCount = SHIFT_ASSIGNMENTS.filter(
  (a) => a.date === today,
).length;
const activeTaskCount = STAFF_TASKS.filter((t) => t.status !== "done").length;
const fullTime = STAFF_MEMBERS.filter((m) => m.role === "full_time").length;
const partTime = STAFF_MEMBERS.filter((m) => m.role === "part_time").length;

const PILLS = [
  {
    label: "Nhân viên",
    value: String(STAFF_MEMBERS.length),
    icon: MdGroups,
    color: "#4ECDC4",
  },
  {
    label: "Báo cáo chờ",
    value: String(submittedCount),
    icon: MdAssignment,
    color: "#FF8C42",
  },
  {
    label: "Ca hôm nay",
    value: String(todayShiftCount),
    icon: MdSchedule,
    color: "#FFD93D",
  },
  {
    label: "Đang làm",
    value: String(activeTaskCount),
    icon: MdTaskAlt,
    color: "#7C5CFC",
  },
];

export default function StaffManageHero() {
  return (
    <div className="relative bg-[#17409A] rounded-3xl overflow-hidden p-6 sm:p-8">
      <GiPawPrint
        className="absolute -top-12 -right-10 text-white/4 pointer-events-none"
        style={{ fontSize: 300 }}
      />
      <GiPawPrint
        className="absolute bottom-6 left-52 text-white/5 pointer-events-none rotate-12"
        style={{ fontSize: 80 }}
      />

      <div className="relative">
        <p className="text-white/50 text-[10px] font-black tracking-[0.28em] uppercase mb-2">
          Quản lý nhân viên
        </p>

        {/* Giant count + subtitle */}
        <div className="flex items-end gap-4 flex-wrap mb-6">
          <span
            className="text-white font-black leading-none"
            style={{ fontSize: "clamp(3.5rem, 6.5vw, 6rem)", lineHeight: 1 }}
          >
            {STAFF_MEMBERS.length}
          </span>
          <div className="flex flex-col mb-1.5">
            <span className="text-white/50 text-xs font-semibold leading-tight">
              nhân viên
            </span>
            <span className="text-[#4ECDC4] font-black text-xs leading-tight">
              {fullTime} toàn thời gian · {partTime} bán thời gian
            </span>
          </div>
        </div>

        {/* Staff avatar row */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {STAFF_MEMBERS.map((m) => (
            <div key={m.id} className="flex items-center gap-2">
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg"
                style={{ backgroundColor: m.color }}
                title={m.name}
              >
                {m.initial}
              </div>
              <div>
                <p className="text-white text-xs font-bold leading-tight">
                  {m.name}
                </p>
                <p className="text-white/40 text-[9px]">
                  {m.role === "full_time" ? "Toàn thời gian" : "Bán thời gian"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stat pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PILLS.map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="flex items-center gap-2 bg-white/8 rounded-2xl px-3 py-2"
            >
              <Icon style={{ color, fontSize: 16 }} />
              <div>
                <span className="text-white font-black text-base leading-none block">
                  {value}
                </span>
                <span className="text-white/40 text-[9px] font-semibold leading-tight">
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
