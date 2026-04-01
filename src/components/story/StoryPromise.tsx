import Link from "next/link";
import { STORY_PROMISES } from "@/data/story";

export default function StoryPromise() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-16">
        <div className="relative">
          <span className="story-watermark hidden md:block pointer-events-none absolute right-0 -top-4 text-[90px] md:text-[120px] font-black text-[#FFFFFF] opacity-[0.3] leading-none z-10">
            04
          </span>
          <div className="story-panel rounded-3xl bg-[#17409A] text-white p-7 md:p-10 lg:p-12">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
              <div className="max-w-3xl">
                <h2 className="text-3xl md:text-4xl font-black leading-tight">
                  <span className="story-chapter-title story-reveal-wrap block overflow-hidden">
                    <span className="story-reveal-line block">
                      Chương 04 - Lời hứa từ Design a Bear
                    </span>
                  </span>
                </h2>
                <p className="mt-3 text-white/80 text-base md:text-lg">
                  Chúng tôi tiếp tục đầu tư vào nội dung học tập, nâng cấp AI và
                  xây dựng công cụ để phụ huynh dễ dàng đồng hành cùng con mỗi
                  ngày.
                </p>
              </div>

              <Link
                href="/products"
                className="inline-flex items-center justify-center min-h-11 px-6 py-3 rounded-2xl bg-white text-[#17409A] font-extrabold hover:bg-[#EAF0FF] transition-colors"
              >
                Khám phá bộ sưu tập
              </Link>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-4">
              {STORY_PROMISES.map((item) => (
                <article
                  key={item.id}
                  className="story-panel rounded-2xl border border-white/20 bg-white/10 p-4"
                >
                  <h3 className="font-bold text-base">{item.title}</h3>
                  <p className="mt-2 text-sm text-white/80 leading-relaxed">
                    {item.detail}
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
