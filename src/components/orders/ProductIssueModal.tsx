"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { MdClose, MdCloudUpload, MdDelete } from "react-icons/md";
import { mediaService } from "@/services/media.service";
import { productIssueService } from "@/services/productIssue.service";
import { useToast } from "@/contexts/ToastContext";

interface ProductIssueModalProps {
  orderItemId: string;
  productName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductIssueModal({
  orderItemId,
  productName,
  isOpen,
  onClose,
  onSuccess,
}: ProductIssueModalProps) {
  const [description, setDescription] = useState("");
  const [requestRefund, setRequestRefund] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { success, error } = useToast();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      if (images.length + filesArray.length > 5) {
        error("Bạn chỉ có thể tải lên tối đa 5 hình ảnh");
        return;
      }
      setImages((prev) => [...prev, ...filesArray]);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      error("Vui lòng nhập mô tả sự cố");
      return;
    }

    try {
      setIsSubmitting(true);

      // 1. Upload images
      const uploadedUrls: string[] = [];
      for (const file of images) {
        const uploadRes = await mediaService.uploadMedia(file, "issues");
        if (uploadRes.isSuccess && uploadRes.value?.publicUrl) {
          uploadedUrls.push(uploadRes.value.publicUrl);
        } else {
          throw new Error("Lỗi khi tải ảnh lên");
        }
      }

      // 2. Submit report
      const res = await productIssueService.createIssueReport({
        orderItemId,
        description,
        requestRefund,
        evidenceUrls: uploadedUrls,
      });

      if (res.isSuccess) {
        success("Đã gửi yêu cầu bảo hành/báo lỗi thành công");
        onSuccess();
        onClose();
        // reset form
        setDescription("");
        setRequestRefund(false);
        setImages([]);
      } else {
        error(res.error?.description || "Có lỗi xảy ra khi tạo báo cáo");
      }
    } catch (err: any) {
      console.error("Submit error:", err);
      error(err.message || "Đã xảy ra lỗi, vui lòng thử lại sau");
    } finally {
      setIsSubmitting(false);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-[#E5E7EB] flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-xl font-black text-[#1A1A2E]">
              Yêu cầu bảo hành / Báo lỗi
            </h3>
            <p className="text-[#6B7280] text-sm mt-1 line-clamp-1">
              Sản phẩm: <span className="font-bold">{productName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[#9CA3AF] hover:text-[#1A1A2E] hover:bg-[#F4F7FF] transition-all"
          >
            <MdClose className="text-lg" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <form id="issue-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-black text-[#1A1A2E] mb-2">
                Mô tả chi tiết vấn đề <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Vui lòng mô tả chi tiết lỗi sản phẩm bạn gặp phải..."
                rows={4}
                className="w-full bg-[#F4F7FF] text-[#1A1A2E] text-sm font-semibold placeholder:text-[#9CA3AF] rounded-xl px-4 py-3 outline-none border-2 border-transparent focus:border-[#17409A]/20 transition-colors resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-black text-[#1A1A2E] mb-2">
                Hình ảnh bằng chứng (Tối đa 5 ảnh)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-xl overflow-hidden border border-[#E5E7EB] group"
                  >
                    <img
                      src={URL.createObjectURL(img)}
                      alt="Evidence"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center text-white transition-all"
                    >
                      <MdDelete className="text-xl" />
                    </button>
                  </div>
                ))}
                {images.length < 5 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-[#D7DEEF] flex flex-col items-center justify-center cursor-pointer hover:bg-[#F4F7FF] hover:border-[#17409A]/40 transition-colors text-[#9CA3AF] hover:text-[#17409A]">
                    <MdCloudUpload className="text-2xl mb-1" />
                    <span className="text-xs font-bold">Thêm ảnh</span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer group mt-2">
              <div className="relative flex items-center justify-center w-5 h-5 mt-0.5">
                <input
                  type="checkbox"
                  checked={requestRefund}
                  onChange={(e) => setRequestRefund(e.target.checked)}
                  className="peer appearance-none w-5 h-5 border-2 border-[#D7DEEF] rounded-md checked:bg-[#17409A] checked:border-[#17409A] transition-colors cursor-pointer"
                />
                <svg
                  className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-black text-[#1A1A2E] group-hover:text-[#17409A] transition-colors">
                  Tôi muốn yêu cầu hoàn tiền
                </p>
                <p className="text-xs text-[#6B7280] font-semibold mt-0.5">
                  Chọn mục này nếu bạn muốn hoàn tiền thay vì gửi bảo hành / sửa
                  chữa.
                </p>
              </div>
            </label>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#E5E7EB] flex items-center justify-end gap-3 bg-[#F8F9FF] shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl text-sm font-black text-[#6B7280] hover:bg-[#E5E7EB]/50 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            form="issue-form"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl text-sm font-black bg-[#17409A] text-white hover:bg-[#0f2d70] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Đang gửi...
              </>
            ) : (
              "Gửi yêu cầu"
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
