import Link from "next/link";
import { GiBearFace, GiPawPrint } from "react-icons/gi";
import { IoChatbubblesOutline, IoCallOutline } from "react-icons/io5";
import ConnectPhraseReveal from "./ConnectPhraseReveal";

export default function ConnectHero() {
  return (
    <section className="bg-[#F4F7FF] pt-30 pb-16 md:pt-40 md:pb-20">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-16">
        <div className="connect-ac relative rounded-3xl border border-[#E5E7EB] bg-white p-7 md:p-10 lg:p-12 shadow-lg overflow-hidden">
          <span className="connect-watermark hidden md:block pointer-events-none absolute right-8 bottom-2 text-[92px] md:text-[120px] font-black text-[#17409A] opacity-[0.06] leading-none">
            01
          </span>
          <GiPawPrint className="absolute -top-8 right-0 text-[130px] text-[#17409A] opacity-5" />

          <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-8 items-end">
            <div>
              <span className="connect-chapter-title connect-reveal inline-flex items-center gap-2 rounded-full px-4 py-2 bg-[#17409A]/10 text-[#17409A] text-sm font-bold">
                <GiBearFace className="text-lg" />
                Cổng kết nối cộng đồng
              </span>

              <h1 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-black text-[#17409A] leading-tight">
                <span className="block">
                  <ConnectPhraseReveal text="Kết nối phụ huynh, giáo viên" />
                </span>
                <span className="block">
                  <ConnectPhraseReveal text="và đội ngũ Design a Bear" />
                </span>
              </h1>

              <p className="connect-ac mt-6 max-w-3xl text-base md:text-lg text-[#6B7280] leading-relaxed">
                Đây là nơi mọi phản hồi, câu hỏi và ý tưởng được lắng nghe.
                Chúng tôi xây dựng một không gian trao đổi văn minh, ấm áp và
                chuyên sâu để hành trình học tập của bé luôn được đồng hành trọn
                vẹn.
              </p>

              <div className="connect-ac mt-7 flex flex-wrap gap-3">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center min-h-11 px-6 py-3 rounded-2xl bg-[#17409A] text-white font-extrabold hover:bg-[#0E2A66] transition-colors"
                >
                  Khám phá sản phẩm
                </Link>
                <a
                  href="#form-ket-noi"
                  className="inline-flex items-center justify-center min-h-11 px-6 py-3 rounded-2xl border-2 border-[#17409A] text-[#17409A] font-extrabold hover:bg-[#17409A] hover:text-white transition-colors"
                >
                  Gửi lời nhắn
                </a>
              </div>
            </div>

            <div className="connect-ac rounded-3xl bg-[#17409A] text-white p-6 md:p-7 shadow-xl">
              <p className="text-xs uppercase tracking-[0.18em] text-white/70 font-bold">
                Trực tuyến nhanh
              </p>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-white/10 border border-white/20 p-4 flex items-start gap-3">
                  <IoChatbubblesOutline className="text-2xl mt-0.5" />
                  <div>
                    <p className="font-bold">Chat tư vấn</p>
                    <p className="text-sm text-white/80">
                      Phản hồi trong 5-10 phút giờ hành chính
                    </p>
                  </div>
                </div>
                <div className="rounded-2xl bg-white/10 border border-white/20 p-4 flex items-start gap-3">
                  <IoCallOutline className="text-2xl mt-0.5" />
                  <div>
                    <p className="font-bold">Hotline 1900 2686</p>
                    <p className="text-sm text-white/80">
                      Hỗ trợ nhanh các vấn đề giao hàng và kỹ thuật
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
