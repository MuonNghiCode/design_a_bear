import { GiPawPrint } from "react-icons/gi";

const moments = [
  {
    title: "Workshop phụ huynh",
    subtitle: "Mỗi tháng 2 buổi trực tuyến",
    text: "Giải đáp chuyên sâu về cách dùng AI đúng độ tuổi và xây dựng thói quen học tích cực tại nhà.",
  },
  {
    title: "Phiên hỏi đáp cùng giáo viên",
    subtitle: "Livestream hàng tuần",
    text: "Chia sẻ phương pháp biến các hoạt động nhỏ thành bài học thú vị cùng gấu bông thông minh.",
  },
  {
    title: "Góc ý tưởng sản phẩm",
    subtitle: "Đồng sáng tạo với cộng đồng",
    text: "Mọi đề xuất thực tế từ gia đình có thể trở thành tính năng mới trong các bản cập nhật tới.",
  },
];

export default function ConnectCommunity() {
  return (
    <section className="bg-[#F4F7FF] py-18 md:py-24">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-16">
        <div className="connect-ac relative rounded-3xl border border-[#E5E7EB] bg-white p-7 md:p-10 lg:p-12 shadow-lg overflow-hidden">
          <span className="connect-watermark hidden md:block pointer-events-none absolute right-8 top-2 text-[92px] md:text-[120px] font-black text-[#17409A] opacity-[0.06] leading-none">
            03
          </span>
          <GiPawPrint className="absolute -left-6 -bottom-8 text-[120px] text-[#17409A] opacity-5" />

          <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-8 lg:gap-12 items-start">
            <div>
              <p className="connect-chapter-title connect-reveal text-sm font-bold tracking-wider uppercase text-[#9CA3AF]">
                Cộng đồng
              </p>
              <h2 className="connect-reveal mt-3 text-3xl md:text-4xl font-black text-[#17409A] leading-tight">
                Kết nối để cùng nuôi dưỡng hành trình học tập của bé
              </h2>
              <p className="connect-ac mt-4 text-base md:text-lg text-[#6B7280] leading-relaxed">
                Không chỉ là một kênh hỗ trợ, trang Kết nối là không gian để phụ
                huynh, giáo viên và đội ngũ sản phẩm đồng sáng tạo một môi
                trường học tập bền vững.
              </p>
            </div>

            <div className="space-y-4">
              {moments.map((item, idx) => (
                <article
                  key={item.title}
                  className="connect-ac rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] p-5 md:p-6"
                >
                  <p className="text-xs font-black tracking-wider text-[#9CA3AF] uppercase">
                    Chặng {idx + 1}
                  </p>
                  <h3 className="mt-2 text-xl font-black text-[#1A1A2E]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm font-bold text-[#17409A]">
                    {item.subtitle}
                  </p>
                  <p className="mt-2 text-sm md:text-base text-[#6B7280] leading-relaxed">
                    {item.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
