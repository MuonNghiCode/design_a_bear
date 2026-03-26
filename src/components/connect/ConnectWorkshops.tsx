import {
  IoCalendarOutline,
  IoTimeOutline,
  IoPeopleOutline,
} from "react-icons/io5";

const upcoming = [
  {
    date: "05/04/2026",
    time: "20:00 - 21:15",
    title: "Workshop: AI đồng hành học Toán tại nhà",
    seats: "Còn 42 chỗ",
    host: "Diễn giả: Cô Minh Anh",
  },
  {
    date: "12/04/2026",
    time: "19:30 - 20:45",
    title: "Q&A trực tiếp: Thiết lập thói quen học cho bé",
    seats: "Còn 26 chỗ",
    host: "Diễn giả: ThS. Tâm Phúc",
  },
  {
    date: "19/04/2026",
    time: "20:00 - 21:00",
    title: "Livestream: Kích hoạt tính năng IoT nâng cao",
    seats: "Còn 58 chỗ",
    host: "Diễn giả: Team Product",
  },
];

export default function ConnectWorkshops() {
  return (
    <section className="bg-white py-18 md:py-24">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-16">
        <div className="relative">
          <span className="connect-watermark hidden md:block pointer-events-none absolute right-0 top-0 text-[92px] md:text-[120px] font-black text-[#17409A] opacity-[0.06] leading-none">
            04
          </span>
          <div className="connect-ac mb-9 md:mb-12">
            <p className="connect-chapter-title connect-reveal text-sm font-bold tracking-wider uppercase text-[#9CA3AF]">
              Lịch cộng đồng
            </p>
            <h2 className="connect-reveal mt-3 text-3xl md:text-4xl font-black text-[#17409A]">
              Workshop sắp diễn ra
            </h2>
          </div>

          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-5 md:gap-6">
            <div className="space-y-4">
              {upcoming.map((item) => (
                <article
                  key={item.title}
                  className="connect-ac rounded-3xl border border-[#E5E7EB] bg-[#F9FAFB] p-5 md:p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm">
                    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-[#17409A]/10 text-[#17409A] font-bold">
                      <IoCalendarOutline />
                      {item.date}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 bg-[#4ECDC4]/15 text-[#138980] font-bold">
                      <IoTimeOutline />
                      {item.time}
                    </span>
                  </div>

                  <h3 className="mt-4 text-xl font-black text-[#1A1A2E] leading-snug">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#6B7280] font-semibold">
                    {item.host}
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#FF8C42]">
                    {item.seats}
                  </p>
                </article>
              ))}
            </div>

            <aside className="connect-ac rounded-3xl bg-[#17409A] text-white p-6 md:p-7 shadow-xl h-fit lg:sticky lg:top-28">
              <p className="text-xs uppercase tracking-[0.18em] text-white/70 font-bold">
                Vì sao nên tham gia?
              </p>
              <h3 className="mt-3 text-2xl font-black leading-tight">
                Gặp chuyên gia, học đúng cách, áp dụng ngay trong tuần.
              </h3>

              <div className="mt-5 space-y-3">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <p className="font-bold">Nội dung ngắn gọn, thực tế</p>
                  <p className="mt-1 text-sm text-white/80">
                    Tập trung vào vấn đề gia đình thường gặp khi bé bắt đầu học
                    cùng AI.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4">
                  <p className="font-bold">Hỏi đáp trực tiếp</p>
                  <p className="mt-1 text-sm text-white/80">
                    Đặt câu hỏi riêng cho chuyên gia và nhận gợi ý cá nhân hóa
                    theo độ tuổi của bé.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/20 bg-white/10 p-4 flex items-start gap-2">
                  <IoPeopleOutline className="text-xl mt-0.5" />
                  <p className="text-sm text-white/85">
                    Mỗi buổi có cộng đồng phụ huynh cùng chia sẻ kinh nghiệm
                    thực tế.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
