"use client";

import { useState } from "react";
import {
  MdAdd,
  MdClose,
  MdCheckCircle,
  MdRadioButtonUnchecked,
  MdPending,
} from "react-icons/md";
import {
  STAFF_TASKS,
  STAFF_MEMBERS,
  TASK_TYPE_CFG,
  type StaffTask,
  type TaskType,
  type TaskPriority,
  type TaskStatus,
} from "@/data/staff";

type FilterTab = "all" | TaskStatus;

const STATUS_NEXT: Record<TaskStatus, TaskStatus> = {
  pending: "in_progress",
  in_progress: "done",
  done: "done",
};
const STATUS_ICON: Record<
  TaskStatus,
  React.ComponentType<{ style?: React.CSSProperties }>
> = {
  pending: MdRadioButtonUnchecked,
  in_progress: MdPending,
  done: MdCheckCircle,
};
const STATUS_COLOR: Record<TaskStatus, string> = {
  pending: "#9CA3AF",
  in_progress: "#FF8C42",
  done: "#4ECDC4",
};
const STATUS_LABEL: Record<TaskStatus, string> = {
  pending: "Chờ làm",
  in_progress: "Đang làm",
  done: "Xong",
};

const PRIORITY_CFG: Record<TaskPriority, { label: string; color: string }> = {
  urgent: { label: "Khẩn", color: "#FF6B9D" },
  normal: { label: "BT", color: "#17409A" },
  low: { label: "Thấp", color: "#9CA3AF" },
};

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ làm" },
  { key: "in_progress", label: "Đang làm" },
  { key: "done", label: "Xong" },
];

interface CreateForm {
  type: TaskType;
  product: string;
  orderId: string;
  customer: string;
  priority: TaskPriority;
  dueBy: string;
  note: string;
  assignedToId: string;
}
const EMPTY: CreateForm = {
  type: "pack",
  product: "",
  orderId: "",
  customer: "",
  priority: "normal",
  dueBy: "",
  note: "",
  assignedToId: "",
};

// ── Create task modal ─────────────────────────────────────────────────────────
function CreateModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (task: StaffTask) => void;
}) {
  const [form, setForm] = useState<CreateForm>(EMPTY);
  function set<K extends keyof CreateForm>(k: K, v: CreateForm[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  const isValid = form.product.trim() && form.dueBy.trim();

  function handleCreate() {
    if (!isValid) return;
    const assignee = STAFF_MEMBERS.find((m) => m.id === form.assignedToId);
    const task: StaffTask = {
      id: `T-${Date.now()}`,
      type: form.type,
      product: form.product.trim(),
      orderId: form.orderId.trim() || undefined,
      customer: form.customer.trim() || undefined,
      priority: form.priority,
      dueBy: form.dueBy.trim(),
      status: "pending",
      note: form.note.trim() || undefined,
      assignedToId: form.assignedToId || undefined,
      assignedToName: assignee?.name,
    };
    onCreate(task);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#17409A] px-6 py-5 flex items-start justify-between">
          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-0.5">
              Giao việc mới
            </p>
            <p className="text-white font-black text-base">Tạo nhiệm vụ</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/15 hover:bg-white/25 flex items-center justify-center text-white transition-colors cursor-pointer shrink-0"
          >
            <MdClose className="text-lg" />
          </button>
        </div>

        <div className="p-6 flex flex-col gap-4 max-h-[65vh] overflow-y-auto">
          {/* Task type */}
          <div>
            <label className="text-[#1A1A2E] text-sm font-bold block mb-2">
              Loại nhiệm vụ
            </label>
            <div className="flex flex-wrap gap-2">
              {(
                Object.entries(TASK_TYPE_CFG) as [
                  TaskType,
                  (typeof TASK_TYPE_CFG)[TaskType],
                ][]
              ).map(([k, cfg]) => (
                <button
                  key={k}
                  onClick={() => set("type", k)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  style={{
                    color: form.type === k ? "white" : cfg.color,
                    backgroundColor: form.type === k ? cfg.color : cfg.bg,
                  }}
                >
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Product + Order */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#1A1A2E] text-sm font-bold block mb-1.5">
                Sản phẩm / Mô tả *
              </label>
              <input
                type="text"
                value={form.product}
                onChange={(e) => set("product", e.target.value)}
                placeholder="Tên sản phẩm…"
                className="w-full bg-[#F4F7FF] rounded-xl px-3 py-2.5 text-sm text-[#1A1A2E] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#17409A]/30 transition"
              />
            </div>
            <div>
              <label className="text-[#1A1A2E] text-sm font-bold block mb-1.5">
                Mã đơn (nếu có)
              </label>
              <input
                type="text"
                value={form.orderId}
                onChange={(e) => set("orderId", e.target.value)}
                placeholder="ORD-000"
                className="w-full bg-[#F4F7FF] rounded-xl px-3 py-2.5 text-sm text-[#1A1A2E] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#17409A]/30 transition"
              />
            </div>
          </div>

          {/* Customer + Due time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#1A1A2E] text-sm font-bold block mb-1.5">
                Tên khách hàng
              </label>
              <input
                type="text"
                value={form.customer}
                onChange={(e) => set("customer", e.target.value)}
                placeholder="Khách hàng…"
                className="w-full bg-[#F4F7FF] rounded-xl px-3 py-2.5 text-sm text-[#1A1A2E] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#17409A]/30 transition"
              />
            </div>
            <div>
              <label className="text-[#1A1A2E] text-sm font-bold block mb-1.5">
                Hạn hoàn thành *
              </label>
              <input
                type="text"
                value={form.dueBy}
                onChange={(e) => set("dueBy", e.target.value)}
                placeholder="VD: 14:30"
                className="w-full bg-[#F4F7FF] rounded-xl px-3 py-2.5 text-sm text-[#1A1A2E] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#17409A]/30 transition"
              />
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="text-[#1A1A2E] text-sm font-bold block mb-2">
              Độ ưu tiên
            </label>
            <div className="flex gap-2">
              {(["urgent", "normal", "low"] as TaskPriority[]).map((p) => {
                const cfg = PRIORITY_CFG[p];
                return (
                  <button
                    key={p}
                    onClick={() => set("priority", p)}
                    className="flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    style={{
                      color: form.priority === p ? "white" : cfg.color,
                      backgroundColor:
                        form.priority === p ? cfg.color : cfg.color + "18",
                    }}
                  >
                    {cfg.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Assign to */}
          <div>
            <label className="text-[#1A1A2E] text-sm font-bold block mb-2">
              Giao cho
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => set("assignedToId", "")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  !form.assignedToId
                    ? "bg-[#1A1A2E] text-white"
                    : "bg-[#F4F7FF] text-[#9CA3AF] hover:text-[#1A1A2E]"
                }`}
              >
                Chưa phân công
              </button>
              {STAFF_MEMBERS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => set("assignedToId", m.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border-2"
                  style={{
                    borderColor:
                      form.assignedToId === m.id ? m.color : "transparent",
                    backgroundColor:
                      form.assignedToId === m.id ? m.color + "18" : "#F4F7FF",
                    color: form.assignedToId === m.id ? m.color : "#9CA3AF",
                  }}
                >
                  <div
                    className="w-5 h-5 rounded-lg flex items-center justify-center text-white text-[9px] font-black"
                    style={{ backgroundColor: m.color }}
                  >
                    {m.initial}
                  </div>
                  {m.name.split(" ").pop()}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="text-[#1A1A2E] text-sm font-bold block mb-1.5">
              Ghi chú cho nhân viên
            </label>
            <textarea
              rows={2}
              value={form.note}
              onChange={(e) => set("note", e.target.value)}
              placeholder="Hướng dẫn thêm, lưu ý đặc biệt…"
              className="w-full bg-[#F4F7FF] rounded-xl px-3 py-2.5 text-sm text-[#1A1A2E] placeholder-[#9CA3AF] outline-none focus:ring-2 focus:ring-[#17409A]/30 resize-none transition"
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#F4F7FF] flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-2xl bg-[#F4F7FF] hover:bg-[#EEF1FF] text-[#9CA3AF] font-bold text-sm cursor-pointer transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={handleCreate}
            disabled={!isValid}
            className="flex-1 py-2.5 rounded-2xl bg-[#17409A] hover:bg-[#1a3a8a] text-white font-bold text-sm cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Giao nhiệm vụ
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function TaskAssigner() {
  const [tasks, setTasks] = useState<StaffTask[]>(STAFF_TASKS);
  const [filter, setFilter] = useState<FilterTab>("all");
  const [showCreate, setShowCreate] = useState(false);

  const filtered =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);
  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const inProgressCount = tasks.filter(
    (t) => t.status === "in_progress",
  ).length;
  const doneCount = tasks.filter((t) => t.status === "done").length;

  function advanceStatus(id: string) {
    setTasks((ts) =>
      ts.map((t) =>
        t.id === id ? { ...t, status: STATUS_NEXT[t.status] } : t,
      ),
    );
  }

  function deleteTask(id: string) {
    setTasks((ts) => ts.filter((t) => t.id !== id));
  }

  function handleCreate(task: StaffTask) {
    setTasks((ts) => [task, ...ts]);
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-[#F4F7FF] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#F4F7FF] flex items-center justify-between gap-3 flex-wrap">
        <div>
          <p className="font-black text-[#1A1A2E] text-base">
            Nhiệm vụ hôm nay
          </p>
          <p className="text-[#9CA3AF] text-xs">
            {pendingCount} chờ · {inProgressCount} đang làm · {doneCount} xong
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {/* Filter tabs */}
          <div className="flex gap-1 bg-[#F4F7FF] rounded-xl p-0.5">
            {FILTER_TABS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-2.5 py-1 rounded-[10px] text-[10px] font-bold transition-all cursor-pointer ${
                  filter === key
                    ? "bg-white text-[#17409A] shadow-sm"
                    : "text-[#9CA3AF] hover:text-[#1A1A2E]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 bg-[#17409A] hover:bg-[#1a3a8a] text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer whitespace-nowrap shadow-sm"
          >
            <MdAdd className="text-sm" /> Giao nhiệm vụ
          </button>
        </div>
      </div>

      {/* Task rows */}
      <div className="divide-y divide-[#F4F7FF]">
        {filtered.length === 0 && (
          <div className="p-8 text-center text-[#9CA3AF] text-sm">
            Không có nhiệm vụ nào
          </div>
        )}

        {filtered.map((task) => {
          const typeCfg = TASK_TYPE_CFG[task.type];
          const StatusIcon = STATUS_ICON[task.status];
          const priorityCfg = PRIORITY_CFG[task.priority];
          const assignee = task.assignedToId
            ? STAFF_MEMBERS.find((m) => m.id === task.assignedToId)
            : null;

          return (
            <div
              key={task.id}
              className={`px-5 py-3.5 flex items-center gap-3 transition-colors group ${
                task.status === "done" ? "bg-[#F8F9FF]" : "hover:bg-[#F8F9FF]"
              }`}
            >
              {/* Status toggle */}
              <button
                onClick={() => advanceStatus(task.id)}
                className="shrink-0 cursor-pointer transition-transform hover:scale-110"
                title={`${STATUS_LABEL[task.status]} — click để cập nhật`}
                disabled={task.status === "done"}
              >
                <StatusIcon
                  style={{ color: STATUS_COLOR[task.status], fontSize: 20 }}
                />
              </button>

              {/* Type badge */}
              <span
                className="shrink-0 text-[9px] font-black px-2 py-1 rounded-full"
                style={{ color: typeCfg.color, backgroundColor: typeCfg.bg }}
              >
                {typeCfg.label}
              </span>

              {/* Main info */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-bold leading-snug ${
                    task.status === "done"
                      ? "line-through text-[#9CA3AF]"
                      : "text-[#1A1A2E]"
                  }`}
                >
                  {task.product}
                </p>
                <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                  {task.orderId && (
                    <span className="text-[10px] text-[#17409A] font-semibold">
                      {task.orderId}
                    </span>
                  )}
                  {task.customer && (
                    <span className="text-[10px] text-[#9CA3AF]">
                      · {task.customer}
                    </span>
                  )}
                  {task.note && (
                    <span className="text-[10px] text-[#9CA3AF] italic">
                      · {task.note}
                    </span>
                  )}
                </div>
              </div>

              {/* Right meta */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Assignee chip */}
                {assignee ? (
                  <div
                    className="w-6 h-6 rounded-lg flex items-center justify-center text-white text-[9px] font-black"
                    style={{ backgroundColor: assignee.color }}
                    title={assignee.name}
                  >
                    {assignee.initial}
                  </div>
                ) : (
                  <span className="text-[9px] text-[#C4CAD4] font-semibold w-6 text-center">
                    —
                  </span>
                )}

                {/* Priority pill */}
                <span
                  className="text-[9px] font-black px-1.5 py-0.5 rounded-full"
                  style={{
                    color: priorityCfg.color,
                    backgroundColor: priorityCfg.color + "18",
                  }}
                >
                  {priorityCfg.label}
                </span>

                {/* Due time */}
                <span className="text-[10px] font-bold text-[#9CA3AF] w-10 text-right">
                  {task.dueBy}
                </span>

                {/* Delete (only done) */}
                {task.status === "done" && (
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg bg-[#FF6B9D]/10 hover:bg-[#FF6B9D]/20 flex items-center justify-center text-[#FF6B9D] transition-all cursor-pointer"
                    title="Xóa nhiệm vụ đã hoàn thành"
                  >
                    <MdClose className="text-xs" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
