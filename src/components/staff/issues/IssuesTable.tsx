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
  { key: "RESOLVED", label: "Đã có hướng xử lý" },
  { key: "CLOSED", label: "Hoàn tất" },
  { key: "REJECTED", label: "Từ chối" },
];

export default function IssuesTable() {
  const [tab, setTab] = useState("PENDING");
  const [issues, setIssues] = useState<ProductIssueReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<ProductIssueReport | null>(
    null,
  );
  const [actionType, setActionType] = useState<
    "resolve" | "complete" | "reject" | null
  >(null);

  const { success, error } = useToast();

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const res = await productIssueService.getAllIssues({
        status: tab,
        pageIndex: 1,
        pageSize: 50,
      });

      if (res.isSuccess && res.value) {
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
    <div className="space-y-6">
      {/* ── Search & Tabs (Admin style) ── */}
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="flex items-center gap-2 p-1.5 bg-white rounded-2xl shadow-sm border border-white/50 overflow-x-auto max-w-full no-scrollbar">
          {TABS.map(({ key, label }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`px-5 py-2.5 rounded-xl text-[13px] font-black transition-all uppercase tracking-wider whitespace-nowrap ${
                  active
                    ? "bg-[#17409A] text-white shadow-md"
                    : "text-gray-400 hover:text-[#17409A] hover:bg-gray-50"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing || loading}
          className="flex items-center gap-2 bg-white border border-white/50 text-[#17409A] text-[13px] font-black px-6 py-3.5 rounded-2xl hover:bg-gray-50 transition-all shadow-sm uppercase tracking-widest disabled:opacity-50"
          title="Làm mới dữ liệu"
        >
          <MdRefresh className={`text-xl ${refreshing ? "animate-spin" : ""}`} />
          <span>Làm mới</span>
        </button>
      </div>

      <div className="bg-white rounded-[32px] overflow-hidden border border-white/50 shadow-sm border-b-8 border-b-[#f4f7ff] mt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F4F7FF]/50 border-b border-[#f4f7ff]">
                <th className="px-6 py-5 text-[11px] font-black text-[#6B7280] uppercase tracking-wider">
                  Mã báo cáo
                </th>
                <th className="px-6 py-5 text-[11px] font-black text-[#6B7280] uppercase tracking-wider">
                  Loại Y/C
                </th>
                <th className="px-6 py-5 text-[11px] font-black text-[#6B7280] uppercase tracking-wider">
                  Mô tả
                </th>
                <th className="px-6 py-5 text-[11px] font-black text-[#6B7280] uppercase tracking-wider">
                  Ngày gửi
                </th>
                <th className="px-6 py-5 text-[11px] font-black text-[#6B7280] uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center px-6 py-10 text-[#9CA3AF] text-sm">
                    Đang tải...
                  </td>
                </tr>
              ) : issues.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 px-6">
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
                      className="group transition-all hover:bg-[#F4F7FF]/30"
                    >
                      <td className="px-6 py-5 border-b border-gray-50">
                        <span className="text-[11px] font-black text-[#17409A] bg-[#17409A]/8 px-2.5 py-1 rounded-lg font-mono">
                          #{issue.reportId?.slice(-6).toUpperCase() || "..."}
                        </span>
                      </td>
                      <td className="px-6 py-5 border-b border-gray-50">
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
                      <td className="px-6 py-5 border-b border-gray-50 max-w-xs">
                        <p className="text-[#1A1A2E] text-sm truncate font-semibold">
                          {issue.description}
                        </p>
                      </td>
                      <td className="px-6 py-5 border-b border-gray-50">
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
                      <td className="px-6 py-5 border-b border-gray-50">
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
                          {(tab === "PENDING" || tab === "PROCESSING") && (
                            <button
                              onClick={() => {
                                setSelectedIssue(issue);
                                setActionType("reject");
                              }}
                              className="text-[11px] font-black bg-red-50 text-red-600 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-xl transition-all"
                            >
                              Từ chối
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
  actionType: "resolve" | "complete" | "reject" | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [resolution, setResolution] = useState("");
  const [staffNotes, setStaffNotes] = useState("");
  const [repairNotes, setRepairNotes] = useState("");
  const [finalNotes, setFinalNotes] = useState("");
  const [rejectReason, setRejectReason] = useState("");
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
      } else if (actionType === "reject") {
        if (!rejectReason.trim()) {
          error("Vui lòng nhập lý do từ chối");
          return;
        }
        const res = await productIssueService.rejectIssue(issue.reportId, {
          reason: rejectReason,
        });
        if (res.isSuccess || res.value === null) {
          success("Đã từ chối báo cáo bảo hành");
          onSuccess();
        } else {
          error(res.error?.description || "Lỗi từ chối báo cáo");
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

          {actionType === "reject" && (
            <div className="space-y-4">
              <h4 className="font-black text-red-600 mb-3">
                Từ chối tiếp nhận
              </h4>
              <div>
                <label className="block text-xs font-bold text-[#1A1A2E] mb-1">
                  Lý do từ chối <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={4}
                  className="w-full bg-[#F4F7FF] text-[#1A1A2E] text-sm rounded-xl px-4 py-2.5 outline-none font-semibold border-2 border-transparent focus:border-red-200 transition-all"
                  placeholder="Nhập lý do tại sao không tiếp nhận yêu cầu này..."
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
