"use client";

import { useState, useEffect, useMemo } from "react";
import { productIssueService } from "@/services/productIssue.service";
import type { ProductIssueReport } from "@/types";
import { useToast } from "@/contexts/ToastContext";
import { MdRefresh, MdClose, MdRemoveRedEye } from "react-icons/md";
import { GiPawPrint } from "react-icons/gi";

const TABS = [
  { key: "PENDING", label: "Chờ lấy đơn" },
  { key: "PROCESSING", label: "Đang xử lý" },
  { key: "RESOLVED", label: "Đã có hướng XL" },
  { key: "CLOSED", label: "Hoàn tất (Đóng)" },
];

export default function IssuesTable() {
  const [tab, setTab] = useState("PENDING");
  const [issues, setIssues] = useState<ProductIssueReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<ProductIssueReport | null>(
    null,
  );
  const [actionType, setActionType] = useState<"resolve" | "complete" | null>(
    null,
  );

  const { success, error } = useToast();

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await productIssueService.getIssuesByStatus(tab, {
        pageIndex: 1,
        pageSize: 50, // Get enough for one view
      });

      if (res.isSuccess && res.value) {
        // Handle both Array and PaginatedResponse structures
        const data = Array.isArray(res.value)
          ? res.value
          : (res.value as any).items || [];
        setIssues(data);
      } else {
        setIssues([]);
      }
    } catch {
      setIssues([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchIssues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchIssues();
  };

  const handleAssign = async (id: string) => {
    try {
      const res = await productIssueService.assignIssue(id);
      if (res.isSuccess || res.value === null) {
        success("Đã nhận xử lý báo cáo này");
        fetchIssues();
      } else {
        error(res.error?.description || "Lỗi khi nhận xử lý");
      }
    } catch (err: any) {
      error(err.message || "Lỗi tham gia xử lý");
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <p className="text-[#9CA3AF] text-[10px] font-black tracking-[0.22em] uppercase mb-0.5">
            Quản lý
          </p>
          <p className="text-[#1A1A2E] font-black text-xl">Yêu cầu bảo hành</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="bg-[#17409A] hover:bg-[#17409A]/90 text-white font-black text-sm rounded-xl px-4 py-2.5 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          <MdRefresh
            className={`text-base ${refreshing ? "animate-spin" : ""}`}
          />
          Làm mới
        </button>
      </div>

      <div className="flex gap-2 flex-wrap mb-5 pb-1 border-b border-[#F4F7FF]">
        {TABS.map(({ key, label }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-200 ${
                active
                  ? "bg-[#17409A] text-white shadow-sm"
                  : "bg-[#F4F7FF] text-[#6B7280] hover:bg-[#E8EEF9]"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-150">
          <thead>
            <tr>
              <th className="text-left text-[9px] font-black text-[#9CA3AF] tracking-[0.2em] uppercase pb-3 pr-4">
                Mã báo cáo
              </th>
              <th className="text-left text-[9px] font-black text-[#9CA3AF] tracking-[0.2em] uppercase pb-3 pr-4">
                Loại Y/C
              </th>
              <th className="text-left text-[9px] font-black text-[#9CA3AF] tracking-[0.2em] uppercase pb-3 pr-4">
                Mô tả
              </th>
              <th className="text-left text-[9px] font-black text-[#9CA3AF] tracking-[0.2em] uppercase pb-3 pr-4">
                Ngày gửi
              </th>
              <th className="text-left text-[9px] font-black text-[#9CA3AF] tracking-[0.2em] uppercase pb-3 pr-4">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-[#9CA3AF]">
                  Đang tải...
                </td>
              </tr>
            ) : issues.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12">
                  <div className="flex flex-col items-center text-center">
                    <GiPawPrint
                      className="text-[#E5E7EB] mb-3"
                      style={{ fontSize: 52 }}
                    />
                    <p className="text-[#9CA3AF] font-black text-sm">
                      Không có báo cáo nào ở trạng thái này
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              issues.map((issue) => {
                const date = new Date(issue.createdAt);
                return (
                  <tr
                    key={issue.reportId}
                    className="border-t border-[#F4F7FF] hover:bg-[#F8F9FF] transition-colors"
                  >
                    <td className="py-4 pr-4">
                      <span className="text-[11px] font-black text-[#17409A] bg-[#17409A]/8 px-2.5 py-1 rounded-lg font-mono">
                        #{issue.reportId?.slice(-6).toUpperCase() || "..."}
                      </span>
                    </td>
                    <td className="py-4 pr-4">
                      <span
                        className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                          issue.requestRefund
                            ? "bg-[#FF8C42]/10 text-[#FF8C42]"
                            : "bg-[#7C5CFC]/10 text-[#7C5CFC]"
                        }`}
                      >
                        {issue.requestRefund ? "Hoàn tiền" : "Bảo hành"}
                      </span>
                    </td>
                    <td className="py-4 pr-4 max-w-xs">
                      <p className="text-[#1A1A2E] text-sm truncate font-semibold">
                        {issue.description}
                      </p>
                    </td>
                    <td className="py-4 pr-4">
                      <p className="text-[#4B5563] font-semibold text-[11px]">
                        {date.toLocaleDateString("vi-VN")}
                      </p>
                      <p className="text-[#9CA3AF] text-[10px]">
                        {date.toLocaleTimeString("vi-VN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedIssue(issue)}
                          className="w-8 h-8 rounded-xl bg-[#F4F7FF] text-[#17409A] hover:bg-[#17409A] hover:text-white transition-all flex items-center justify-center font-bold"
                          title="Xem chi tiết"
                        >
                          <MdRemoveRedEye className="text-base" />
                        </button>
                        {tab === "PENDING" && (
                          <button
                            onClick={() => handleAssign(issue.reportId)}
                            className="text-[11px] font-black bg-[#4ECDC4]/10 text-[#259790] hover:bg-[#4ECDC4] hover:text-white px-3 py-1.5 rounded-xl transition-all"
                          >
                            Nhận xử lý
                          </button>
                        )}
                        {tab === "PROCESSING" && (
                          <button
                            onClick={() => {
                              setSelectedIssue(issue);
                              setActionType("resolve");
                            }}
                            className="text-[11px] font-black bg-[#1D4ED8]/10 text-[#1D4ED8] hover:bg-[#1D4ED8] hover:text-white px-3 py-1.5 rounded-xl transition-all"
                          >
                            Giải quyết
                          </button>
                        )}
                        {tab === "RESOLVED" && (
                          <button
                            onClick={() => {
                              setSelectedIssue(issue);
                              setActionType("complete");
                            }}
                            className="text-[11px] font-black bg-[#4ECDC4]/10 text-[#259790] hover:bg-[#4ECDC4] hover:text-white px-3 py-1.5 rounded-xl transition-all"
                          >
                            Hoàn tất
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedIssue && (
        <IssueDetailModal
          issue={selectedIssue}
          actionType={actionType}
          onClose={() => {
            setSelectedIssue(null);
            setActionType(null);
          }}
          onSuccess={() => {
            setSelectedIssue(null);
            setActionType(null);
            fetchIssues();
          }}
        />
      )}
    </div>
  );
}

function IssueDetailModal({
  issue,
  actionType,
  onClose,
  onSuccess,
}: {
  issue: ProductIssueReport;
  actionType: "resolve" | "complete" | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [resolution, setResolution] = useState("");
  const [staffNotes, setStaffNotes] = useState("");
  const [repairNotes, setRepairNotes] = useState("");
  const [finalNotes, setFinalNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { success, error } = useToast();

  const handleAction = async () => {
    try {
      setSubmitting(true);
      if (actionType === "resolve") {
        if (!resolution.trim()) {
          error("Vui lòng nhập hướng xử lý");
          return;
        }
        const res = await productIssueService.resolveIssue(issue.reportId, {
          resolution,
          staffNotes,
          repairNotes,
        });
        if (res.isSuccess || res.value === null) {
          success("Cập nhật hướng xử lý thành công");
          onSuccess();
        } else {
          error(res.error?.description || "Lỗi cập nhật");
        }
      } else if (actionType === "complete") {
        const res = await productIssueService.completeIssue(issue.reportId, {
          finalNotes,
        });
        if (res.isSuccess || res.value === null) {
          success("Hoàn tất yêu cầu thành công");
          onSuccess();
        } else {
          error(res.error?.description || "Lỗi hoàn tất");
        }
      }
    } catch (err: any) {
      error(err.message || "Đã xảy ra lỗi hệ thống");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between shrink-0">
          <h3 className="text-xl font-black text-[#1A1A2E]">
            Chi tiết Báo cáo #{issue.reportId?.slice(-6).toUpperCase()}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex flex-col items-center justify-center text-[#9CA3AF] hover:bg-[#F4F7FF] hover:text-[#1A1A2E] transition-all"
          >
            <MdClose className="text-lg" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto w-full">
          {/* Customer Info / Issue detail */}
          <div className="mb-6 bg-[#F8F9FF] p-4 rounded-2xl border border-[#E5E7EB]">
            <p className="text-xs text-[#9CA3AF] font-bold uppercase tracking-wider mb-2">
              Thông tin báo lỗi
            </p>
            <p className="text-sm font-semibold text-[#1A1A2E] mb-1">
              Loại:{" "}
              <span
                className={
                  issue.requestRefund ? "text-[#FF8C42]" : "text-[#7C5CFC]"
                }
              >
                {issue.requestRefund
                  ? "Yêu cầu hoàn tiền"
                  : "Bảo hành/Sửa chữa"}
              </span>
            </p>
            <p className="text-sm font-semibold text-[#1A1A2E] mb-3">
              Mô tả lỗi:{" "}
              <span className="font-normal">{issue.description}</span>
            </p>

            {issue.evidenceUrls?.length > 0 && (
              <div>
                <p className="text-xs text-[#9CA3AF] font-bold uppercase tracking-wider mb-2">
                  Bằng chứng
                </p>
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {issue.evidenceUrls.map((url, idx) => (
                    <a
                      key={idx}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-[#E5E7EB]"
                    >
                      <img
                        src={url}
                        alt="Evidence"
                        className="w-full h-full object-cover"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions Forms */}
          {actionType === "resolve" && (
            <div className="space-y-4">
              <h4 className="font-black text-[#1A1A2E] mb-3">
                Cập nhật hướng xử lý (Resolve)
              </h4>
              <div>
                <label className="block text-xs font-bold text-[#1A1A2E] mb-1">
                  Hướng giải quyết <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full bg-[#F4F7FF] text-[#1A1A2E] text-sm rounded-xl px-4 py-2.5 outline-none font-semibold"
                  placeholder="Ví dụ: Đồng ý bảo hành linh kiện A"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1A1A2E] mb-1">
                  Ghi chú nội bộ
                </label>
                <textarea
                  value={staffNotes}
                  onChange={(e) => setStaffNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-[#F4F7FF] text-[#1A1A2E] text-sm rounded-xl px-4 py-2.5 outline-none"
                  placeholder="(Tùy chọn)"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1A1A2E] mb-1">
                  Chi tiết sửa chữa
                </label>
                <textarea
                  value={repairNotes}
                  onChange={(e) => setRepairNotes(e.target.value)}
                  rows={2}
                  className="w-full bg-[#F4F7FF] text-[#1A1A2E] text-sm rounded-xl px-4 py-2.5 outline-none"
                  placeholder="(Tùy chọn)"
                />
              </div>
            </div>
          )}

          {actionType === "complete" && (
            <div className="space-y-4">
              <h4 className="font-black text-[#1A1A2E] mb-3">
                Hoàn tất bảo hành/hoàn tiền
              </h4>
              <div>
                <label className="block text-xs font-bold text-[#1A1A2E] mb-1">
                  Kết luận cuối cùng
                </label>
                <textarea
                  value={finalNotes}
                  onChange={(e) => setFinalNotes(e.target.value)}
                  rows={3}
                  className="w-full bg-[#F4F7FF] text-[#1A1A2E] text-sm rounded-xl px-4 py-2.5 outline-none"
                  placeholder="Ví dụ: Đã thay thế thành công, gửi lại qua bưu điện báo số hiệu XXXX"
                />
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-[#E5E7EB] bg-[#F8F9FF] flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl font-black text-sm text-[#6B7280] hover:bg-[#E5E7EB]/50 transition-colors"
          >
            Đóng
          </button>
          {actionType && (
            <button
              onClick={handleAction}
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl font-black text-sm bg-[#17409A] text-white hover:bg-[#0f2d70] transition-colors disabled:opacity-50"
            >
              {submitting ? "Đang xử lý..." : "Xác nhận"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
