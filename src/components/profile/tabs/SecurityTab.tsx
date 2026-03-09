"use client";

import { useState } from "react";
import {
  IoShieldCheckmarkOutline,
  IoCheckmarkCircle,
  IoLogOutOutline,
  IoEyeOutline,
  IoEyeOffOutline,
  IoCloseOutline,
  IoLockClosedOutline,
} from "react-icons/io5";

interface Props {
  onLogout: () => void;
}

export default function SecurityTab({ onLogout }: Props) {
  const [showPwModal, setShowPwModal] = useState(false);
  const [twoFA, setTwoFA] = useState(false);
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSuccess, setPwSuccess] = useState(false);

  const handleChangePw = () => {
    setPwError("");
    if (!currentPw || !newPw || !confirmPw) {
      setPwError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    if (newPw.length < 6) {
      setPwError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }
    if (newPw !== confirmPw) {
      setPwError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setPwSuccess(true);
    setTimeout(() => {
      setShowPwModal(false);
      setPwSuccess(false);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
    }, 1500);
  };

  const closeModal = () => {
    setShowPwModal(false);
    setPwError("");
    setPwSuccess(false);
    setCurrentPw("");
    setNewPw("");
    setConfirmPw("");
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <p className="text-[#1A1A2E] font-black text-base mb-1">
          Bảo mật tài khoản
        </p>

        {/* Đổi mật khẩu */}
        <div className="flex items-center gap-4 bg-[#F8F9FF] rounded-2xl p-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#17409A18" }}
          >
            <IoShieldCheckmarkOutline className="text-xl" style={{ color: "#17409A" }} />
          </div>
          <div className="flex-1">
            <p className="text-[#1A1A2E] font-bold text-sm">Đổi mật khẩu</p>
            <p className="text-[#9CA3AF] text-[11px] font-semibold">
              Cập nhật mật khẩu định kỳ để bảo vệ tài khoản
            </p>
          </div>
          <button
            onClick={() => setShowPwModal(true)}
            className="cursor-pointer text-xs font-black px-4 py-2 rounded-xl hover:opacity-80 transition-opacity shrink-0"
            style={{ color: "#17409A", backgroundColor: "#17409A18" }}
          >
            Đổi ngay
          </button>
        </div>

        {/* Xác thực 2 bước */}
        <div className="flex items-center gap-4 bg-[#F8F9FF] rounded-2xl p-4">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: "#4ECDC418" }}
          >
            <IoCheckmarkCircle className="text-xl" style={{ color: "#4ECDC4" }} />
          </div>
          <div className="flex-1">
            <p className="text-[#1A1A2E] font-bold text-sm">Xác thực 2 bước</p>
            <p className="text-[#9CA3AF] text-[11px] font-semibold">
              Thêm lớp bảo mật cho tài khoản của bạn
            </p>
          </div>
          <button
            onClick={() => setTwoFA((v) => !v)}
            className={`cursor-pointer relative w-11 h-6 rounded-full transition-colors duration-300 shrink-0 ${
              twoFA ? "bg-[#4ECDC4]" : "bg-[#E5E7EB]"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                twoFA ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Danger zone */}
        <div className="mt-2 bg-[#FF6B9D]/5 border border-[#FF6B9D]/20 rounded-2xl p-4 flex items-center justify-between">
          <div>
            <p className="text-[#FF6B9D] font-bold text-sm">
              Đăng xuất khỏi tất cả thiết bị
            </p>
            <p className="text-[#9CA3AF] text-[11px] font-semibold">
              Kết thúc tất cả phiên đăng nhập
            </p>
          </div>
          <button
            onClick={onLogout}
          className="cursor-pointer flex items-center gap-1.5 text-[#FF6B9D] text-xs font-black bg-[#FF6B9D]/10 hover:bg-[#FF6B9D]/20 px-4 py-2 rounded-xl transition-colors shrink-0"
          >
            <IoLogOutOutline />
            Đăng xuất
          </button>
        </div>
      </div>

      {/* ── Đổi mật khẩu Modal ─────────────────────────────────────────── */}
      {showPwModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Modal */}
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-[#17409A]/10 flex items-center justify-center">
                  <IoLockClosedOutline className="text-[#17409A] text-xl" />
                </div>
                <div>
                  <p className="text-[#1A1A2E] font-black text-lg leading-tight">Đổi mật khẩu</p>
                  <p className="text-[#9CA3AF] text-[11px] font-semibold">Cập nhật mật khẩu bảo mật</p>
                </div>
              </div>
              <button
                onClick={closeModal}
                className="cursor-pointer w-9 h-9 rounded-xl bg-[#F4F7FF] hover:bg-[#E8EEF9] flex items-center justify-center transition-colors"
              >
                <IoCloseOutline className="text-[#6B7280] text-xl" />
              </button>
            </div>

            <div className="flex flex-col gap-5">
              {/* Current password */}
              <div>
                <label className="text-[10px] font-black tracking-widest text-[#9CA3AF] uppercase mb-2 block">
                  Mật khẩu hiện tại
                </label>
                <div className="relative">
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    placeholder="Nhập mật khẩu hiện tại"
                    className="w-full bg-[#F4F7FF] rounded-2xl px-5 py-3.5 pr-12 text-sm font-bold text-[#1A1A2E] outline-none border-2 border-transparent focus:border-[#17409A]/30 transition-colors placeholder:font-normal placeholder:text-[#C4C9D4]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent((v) => !v)}
                    className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                  >
                    {showCurrent ? <IoEyeOffOutline className="text-lg" /> : <IoEyeOutline className="text-lg" />}
                  </button>
                </div>
              </div>

              {/* New password */}
              <div>
                <label className="text-[10px] font-black tracking-widest text-[#9CA3AF] uppercase mb-2 block">
                  Mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showNew ? "text" : "password"}
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    placeholder="Tối thiểu 6 ký tự"
                    className="w-full bg-[#F4F7FF] rounded-2xl px-5 py-3.5 pr-12 text-sm font-bold text-[#1A1A2E] outline-none border-2 border-transparent focus:border-[#17409A]/30 transition-colors placeholder:font-normal placeholder:text-[#C4C9D4]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew((v) => !v)}
                    className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                  >
                    {showNew ? <IoEyeOffOutline className="text-lg" /> : <IoEyeOutline className="text-lg" />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="text-[10px] font-black tracking-widest text-[#9CA3AF] uppercase mb-2 block">
                  Xác nhận mật khẩu mới
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={confirmPw}
                    onChange={(e) => setConfirmPw(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full bg-[#F4F7FF] rounded-2xl px-5 py-3.5 pr-12 text-sm font-bold text-[#1A1A2E] outline-none border-2 border-transparent focus:border-[#17409A]/30 transition-colors placeholder:font-normal placeholder:text-[#C4C9D4]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((v) => !v)}
                    className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors"
                  >
                    {showConfirm ? <IoEyeOffOutline className="text-lg" /> : <IoEyeOutline className="text-lg" />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {pwError && (
                <div className="bg-[#FF6B9D]/8 border border-[#FF6B9D]/20 rounded-xl px-4 py-2.5">
                  <p className="text-[#FF6B9D] text-xs font-bold">{pwError}</p>
                </div>
              )}

              {/* Success */}
              {pwSuccess && (
                <div className="bg-[#4ECDC4]/10 border border-[#4ECDC4]/30 rounded-xl px-4 py-3 text-center">
                  <p className="text-[#4ECDC4] text-sm font-black">
                    ✓ Đổi mật khẩu thành công!
                  </p>
                </div>
              )}

              {/* Actions */}
              {!pwSuccess && (
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={closeModal}
                    className="cursor-pointer flex-1 py-3.5 rounded-2xl bg-[#F4F7FF] text-[#6B7280] font-black text-sm hover:bg-[#E8EEF9] transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleChangePw}
                    className="cursor-pointer flex-1 py-3.5 rounded-2xl bg-[#17409A] text-white font-black text-sm hover:bg-[#0E2A66] transition-colors shadow-lg shadow-[#17409A]/25"
                  >
                    Xác nhận
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
