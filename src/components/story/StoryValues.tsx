import { STORY_VALUES } from "@/data/story";
import StoryWordReveal from "./StoryWordReveal";

export default function StoryValues() {
  return (
    <section className="bg-[#F4F7FF] py-20 md:py-28">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-16">
        <div className="relative">
          <span className="story-watermark hidden md:block pointer-events-none absolute right-0 top-0 text-[90px] md:text-[120px] font-black text-[#17409A] opacity-[0.06] leading-none">
            03
          </span>
          <div className="story-panel mb-12 md:mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-[#17409A]">
              <span className="story-chapter-title story-reveal-wrap block overflow-hidden">
                <span className="story-reveal-line block">
                  Chương 03 - Những điều chúng tôi bảo vệ
                </span>
              </span>
            </h2>
            <p className="mt-3 text-[#6B7280] text-base md:text-lg max-w-3xl">
              Trước khi là một sản phẩm công nghệ, Design a Bear là một người
              bạn của trẻ. Vì vậy mọi quyết định thiết kế đều bắt đầu từ giá trị
              giáo dục và tính nhân văn.
            </p>
          </div>

          <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-5 md:gap-6 items-start">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {STORY_VALUES.map((value) => (
                <article
                  key={value.id}
                  className="story-panel rounded-3xl bg-white border border-[#E5E7EB] p-6 md:p-7 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-lg"
                    style={{ backgroundColor: value.color }}
                  >
                    {value.id.slice(-1)}
                  </div>

                  <h3 className="mt-4 text-xl font-black text-[#1A1A2E]">
                    {value.title}
                  </h3>
                  <p className="mt-2 text-[#6B7280] text-sm md:text-base leading-relaxed">
                    {value.description}
                  </p>
                </article>
              ))}
            </div>

            <aside className="story-panel rounded-3xl border border-[#E5E7EB] bg-white p-6 md:p-8 shadow-lg lg:sticky lg:top-32">
              <p className="text-xs uppercase tracking-[0.18em] text-[#9CA3AF] font-bold">
                Trích đoạn
              </p>
              <p className="mt-4 text-xl md:text-2xl font-black text-[#17409A] leading-snug">
                <StoryWordReveal text="Công nghệ chỉ thật sự có ý nghĩa khi giúp trẻ em tự tin hơn mỗi ngày." />
              </p>
              <p className="mt-4 text-sm md:text-base text-[#6B7280] leading-relaxed">
                Chúng tôi thiết kế sản phẩm để bé có thể hỏi nhiều hơn, cười
                nhiều hơn và học theo cách tự nhiên nhất, với sự đồng hành chặt
                chẽ từ phụ huynh.
              </p>
            </aside>
          </div>
        </div>
      </div>
    </section>
  );
}
