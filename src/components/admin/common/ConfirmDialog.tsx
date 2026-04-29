"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { MdWarningAmber, MdClose } from "react-icons/md";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onClose: () => void;
  variant?: "danger" | "warning" | "info";
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = "Xác nhận",
  cancelText = "Hủy",
  onConfirm,
  onClose,
  variant = "danger",
}: ConfirmDialogProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      gsap.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3 });
      gsap.fromTo(
        modalRef.current,
        { scale: 0.9, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
      );
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getVariantStyles = () => {
    switch (variant) {
      case "danger":
        return {
          icon: "bg-red-50 text-red-600",
          button: "bg-red-600 hover:bg-red-700 text-white shadow-red-200",
        };
      case "warning":
        return {
          icon: "bg-orange-50 text-orange-600",
          button: "bg-orange-600 hover:bg-orange-700 text-white shadow-orange-200",
        };
      default:
        return {
          icon: "bg-blue-50 text-[#17409A]",
          button: "bg-[#17409A] hover:bg-[#0E2A66] text-white shadow-blue-200",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
    >
      <div
        ref={modalRef}
        className="w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className={`p-4 rounded-[20px] ${styles.icon}`}>
              <MdWarningAmber className="text-3xl" />
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MdClose className="text-xl text-gray-400" />
            </button>
          </div>

          <h3 className="text-xl font-black text-[#1A1A2E] mb-2">{title}</h3>
          <p className="text-gray-500 font-medium leading-relaxed">{message}</p>

          <div className="flex items-center gap-3 mt-8">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3.5 rounded-2xl bg-gray-100 text-gray-600 font-black text-sm hover:bg-gray-200 transition-all"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className={`flex-1 px-6 py-3.5 rounded-2xl font-black text-sm transition-all shadow-lg ${styles.button}`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
