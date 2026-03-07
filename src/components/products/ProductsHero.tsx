import Image from "next/image";

export default function ProductsHero() {
  return (
    <section className="relative w-full h-[700] overflow-hidden">
      <Image
        src="/Hero-background.png"
        alt="Products hero"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Text sits in the lower half of the hero, below the fixed header */}
      <div className="absolute inset-0 flex items-end pb-16 md:pb-20">
        <div className="max-w-screen-2xl w-full mx-auto px-6 md:px-16">
          <p className="text-[#0E2A66]/70 font-bold text-xs uppercase tracking-widest mb-3">
            Bộ sưu tập 2026
          </p>
          <h1 className="text-[#0E2A66] font-black text-3xl md:text-5xl lg:text-6xl leading-tight mb-4">
            Khám phá
            <br />
            <span className="text-[#17409A]">sản phẩm</span>
          </h1>
          <p className="text-[#0E2A66]/65 text-sm md:text-base max-w-xs leading-relaxed">
            Hàng trăm gấu bông thông minh —<br />
            mỗi bé một thế giới riêng.
          </p>
        </div>
      </div>
    </section>
  );
}
