"use client";

import { useMemo, useState } from "react";
import {
  IoCheckmarkCircle,
  IoSend,
  IoChevronBack,
  IoChevronForward,
} from "react-icons/io5";
import CustomDropdown from "@/components/shared/CustomDropdown";

const TOPIC_OPTIONS = [
  { label: "Tư vấn sản phẩm", value: "Tư vấn sản phẩm" },
  { label: "Hỗ trợ kỹ thuật", value: "Hỗ trợ kỹ thuật" },
  { label: "Lộ trình học tập cho bé", value: "Lộ trình học tập cho bé" },
  { label: "Góp ý tính năng mới", value: "Góp ý tính năng mới" },
];

export default function ConnectFormSection() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("Tư vấn sản phẩm");
  const [message, setMessage] = useState("");

  const canNextStep1 = useMemo(
    () => name.trim() && phone.trim(),
    [name, phone],
  );
  const canNextStep2 = useMemo(
    () => email.trim() && topic.trim(),
    [email, topic],
  );
  const canSubmit = useMemo(() => message.trim().length >= 10, [message]);

  return (
    <section id="form-ket-noi" className="bg-white py-18 md:py-24">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-16">
        <div className="relative">
          <span className="connect-watermark hidden md:block pointer-events-none absolute right-2 top-2 text-[92px] md:text-[120px] font-black text-[#17409A] opacity-[0.06] leading-none">
            05
          </span>
          <div className="grid lg:grid-cols-[1fr_1fr] gap-6 md:gap-8 items-stretch">
            <div className="connect-ac rounded-3xl bg-[#17409A] text-white p-7 md:p-9 shadow-xl">
              <p className="connect-chapter-title text-sm font-bold tracking-wider uppercase text-white/70">
                Mở kết nối ngay
              </p>
              <h2 className="connect-reveal mt-3 text-3xl md:text-4xl font-black leading-tight">
                Gửi lời nhắn cho đội ngũ Design a Bear
              </h2>
              <p className="mt-4 text-white/85 text-base leading-relaxed">
                Mô tả ngắn vấn đề hoặc mong muốn của bạn. Chúng tôi sẽ phản hồi
                bằng phương án rõ ràng trong vòng 24 giờ làm việc.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-2">
                  <IoCheckmarkCircle className="text-xl mt-0.5" />
                  <p className="text-sm text-white/85">
                    Tư vấn đúng nhu cầu theo độ tuổi của bé
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <IoCheckmarkCircle className="text-xl mt-0.5" />
                  <p className="text-sm text-white/85">
                    Hướng dẫn setup và sử dụng sản phẩm tối ưu
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <IoCheckmarkCircle className="text-xl mt-0.5" />
                  <p className="text-sm text-white/85">
                    Tiếp nhận góp ý để cải tiến tính năng mới
                  </p>
                </div>
              </div>
            </div>

            <form className="connect-ac rounded-3xl border border-[#E5E7EB] bg-[#F9FAFB] p-6 md:p-8 shadow-sm">
              <div className="mb-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-[#1A1A2E]">
                    Bước {step}/3
                  </p>
                  <p className="text-xs font-semibold text-[#9CA3AF]">
                    {step === 1
                      ? "Thông tin cơ bản"
                      : step === 2
                        ? "Mục tiêu hỗ trợ"
                        : "Lời nhắn chi tiết"}
                  </p>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[#E5E7EB] overflow-hidden">
                  <div
                    className="h-full bg-[#17409A] rounded-full transition-all duration-300"
                    style={{ width: `${(step / 3) * 100}%` }}
                  />
                </div>
              </div>

              {step === 1 && (
                <div className="space-y-3">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm font-bold text-[#1A1A2E]">
                        Họ và tên
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="mt-1.5 w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none focus:border-[#17409A]"
                        placeholder="Nguyễn Thị A"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-[#1A1A2E]">
                        Số điện thoại
                      </label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="mt-1.5 w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none focus:border-[#17409A]"
                        placeholder="090x xxx xxx"
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-bold text-[#1A1A2E]">
                      Email
                    </label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1.5 w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none focus:border-[#17409A]"
                      placeholder="email@domain.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-[#1A1A2E]">
                      Bạn cần hỗ trợ về
                    </label>
                    <div className="mt-1.5">
                      <CustomDropdown
                        options={TOPIC_OPTIONS}
                        value={topic}
                        onChange={setTopic}
                      />
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <label className="text-sm font-bold text-[#1A1A2E]">
                    Nội dung cần hỗ trợ
                  </label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="mt-1.5 w-full rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3 text-sm outline-none focus:border-[#17409A] resize-none"
                    placeholder="Bạn đang cần kết nối về vấn đề gì?"
                  />
                  <p className="mt-1 text-xs text-[#9CA3AF]">
                    Tối thiểu 10 ký tự để gửi yêu cầu.
                  </p>
                </div>
              )}

              <div className="mt-5 flex items-center justify-between gap-3">
                <button
                  type="button"
                  disabled={step === 1}
                  onClick={() => setStep((s) => Math.max(1, s - 1))}
                  className="inline-flex items-center justify-center gap-1 min-h-11 px-4 py-2 rounded-2xl border border-[#D1D5DB] text-[#6B7280] font-bold hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <IoChevronBack />
                  Quay lại
                </button>

                {step < 3 ? (
                  <button
                    type="button"
                    disabled={
                      (step === 1 && !canNextStep1) ||
                      (step === 2 && !canNextStep2)
                    }
                    onClick={() => setStep((s) => Math.min(3, s + 1))}
                    className="inline-flex items-center justify-center gap-1 min-h-11 px-5 py-2 rounded-2xl bg-[#17409A] text-white font-extrabold hover:bg-[#0E2A66] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Tiếp theo
                    <IoChevronForward />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!canSubmit}
                    className="inline-flex items-center justify-center gap-2 min-h-11 px-6 py-3 rounded-2xl bg-[#17409A] text-white font-extrabold hover:bg-[#0E2A66] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <IoSend />
                    Gửi yêu cầu
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
