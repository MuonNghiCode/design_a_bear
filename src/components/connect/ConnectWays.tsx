import {
  IoChatboxEllipsesOutline,
  IoMailOutline,
  IoLogoFacebook,
  IoLogoYoutube,
} from "react-icons/io5";

const channels = [
  {
    title: "Trò chuyện trực tiếp",
    description:
      "Đội ngũ tư vấn đồng hành trong từng bước chọn gấu phù hợp cho bé.",
    detail: "8:00 - 21:00 mỗi ngày",
    icon: IoChatboxEllipsesOutline,
    color: "#17409A",
  },
  {
    title: "Email học vụ",
    description:
      "Gửi góp ý về nội dung học tập, lộ trình AI và tài nguyên phụ huynh.",
    detail: "hello@designabear.vn",
    icon: IoMailOutline,
    color: "#4ECDC4",
  },
  {
    title: "Cộng đồng Facebook",
    description:
      "Tham gia nhóm phụ huynh để chia sẻ kinh nghiệm cùng chuyên gia giáo dục.",
    detail: "35.000+ thành viên",
    icon: IoLogoFacebook,
    color: "#7C5CFC",
  },
  {
    title: "Video hướng dẫn",
    description:
      "Xem kho nội dung setup, chăm sóc và khai thác tính năng thông minh.",
    detail: "Cập nhật 2 video/tuần",
    icon: IoLogoYoutube,
    color: "#FF8C42",
  },
];

export default function ConnectWays() {
  return (
    <section className="bg-white py-18 md:py-24">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-16">
        <div className="relative">
          <span className="connect-watermark hidden md:block pointer-events-none absolute right-0 top-0 text-[92px] md:text-[120px] font-black text-[#17409A] opacity-[0.06] leading-none">
            02
          </span>
          <div className="connect-ac mb-10 md:mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
            <div>
              <p className="connect-chapter-title connect-reveal text-sm font-bold tracking-wider uppercase text-[#9CA3AF]">
                Điểm chạm
              </p>
              <h2 className="connect-reveal mt-3 text-3xl md:text-4xl font-black text-[#17409A]">
                4 cách kết nối linh hoạt
              </h2>
            </div>
            <p className="connect-ac max-w-2xl text-[#6B7280] text-base md:text-lg">
              Bạn có thể chọn bất kỳ kênh nào phù hợp với thói quen của gia
              đình. Mỗi kênh đều được chuẩn hóa để mang lại phản hồi rõ ràng và
              trách nhiệm.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
            {channels.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  key={item.title}
                  className="connect-ac rounded-3xl border border-[#E5E7EB] bg-[#F9FAFB] p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                    style={{ backgroundColor: item.color }}
                  >
                    <Icon className="text-2xl" />
                  </div>
                  <h3 className="mt-4 text-xl font-black text-[#1A1A2E] leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#6B7280] leading-relaxed">
                    {item.description}
                  </p>
                  <p
                    className="mt-4 text-sm font-bold"
                    style={{ color: item.color }}
                  >
                    {item.detail}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
