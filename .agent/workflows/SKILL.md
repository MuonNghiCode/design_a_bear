---
name: Design a Bear - UI Design System
description: Hướng dẫn thiết kế giao diện cho trang thương mại điện tử Design a Bear — bán gấu bông thông minh tích hợp IoT & AI, dạy học cho trẻ em. Phong cách sang trọng, sáng tạo, thân thiện với trẻ em.
---

# 🧸 Design a Bear — UI Design Skill

## Chủ đề & Bối cảnh

**Design a Bear** là một trang **thương mại điện tử** bán **gấu bông thông minh** tích hợp **IoT** và **AI**, tạo thành một **con robot** có khả năng **dạy học** cho trẻ em.

### Từ khóa thiết kế

- **Sang trọng** (Premium): thiết kế tinh tế, hiện đại, không rẻ tiền
- **Sáng tạo** (Creative): layout phá cách, micro-interactions, hiệu ứng bất ngờ
- **Trẻ em** (Child-friendly): vui tươi, gần gũi, dễ sử dụng, gợi cảm giác an toàn & vui nhộn
- **Công nghệ** (Tech-savvy): gợi lên sự hiện đại của IoT & AI nhưng vẫn ấm áp

---

## 🎨 Bảng màu (Color Palette)

### Màu chính

| Token             | Hex       | Mô tả                  | Dùng cho                                                  |
| ----------------- | --------- | ---------------------- | --------------------------------------------------------- |
| `--color-primary` | `#17409A` | **Xanh navy chủ đạo**  | CTA buttons, headings, links, icons chính, brand elements |
| `--color-bg`      | `#F4F7FF` | **Nền sáng xanh nhạt** | Background chính toàn trang                               |

### Bảng màu mở rộng

| Token                    | Hex                       | Mô tả            | Dùng cho                                    |
| ------------------------ | ------------------------- | ---------------- | ------------------------------------------- |
| `--color-primary-light`  | `#4A90E2`                 | Xanh dương sáng  | Hover states, gradient thứ cấp, highlights  |
| `--color-primary-dark`   | `#0E2A66`                 | Navy sẫm         | Text headings quan trọng, dark sections     |
| `--color-primary-50`     | `rgba(23, 64, 154, 0.05)` | Primary rất nhạt | Background nhẹ, cards hover                 |
| `--color-primary-10`     | `rgba(23, 64, 154, 0.10)` | Primary nhạt     | Social buttons bg, badges                   |
| `--color-accent-warm`    | `#FF8C42`                 | Cam ấm           | Highlights trẻ em, sale badges, CTA phụ     |
| `--color-accent-pink`    | `#FF6B9D`                 | Hồng tươi        | Love/wishlist, discount, yếu tố nữ tính     |
| `--color-accent-yellow`  | `#FFD93D`                 | Vàng tươi        | Stars/rating, badges "new", yếu tố vui nhộn |
| `--color-accent-green`   | `#4ECDC4`                 | Xanh mint        | Success state, "in stock", IoT/tech vibe    |
| `--color-accent-purple`  | `#7C5CFC`                 | Tím sáng         | AI features, smart/learning badges          |
| `--color-white`          | `#FFFFFF`                 | Trắng            | Card backgrounds, navbar bg                 |
| `--color-text-primary`   | `#1A1A2E`                 | Gần đen          | Body text chính                             |
| `--color-text-secondary` | `#6B7280`                 | Xám              | Text phụ, descriptions                      |
| `--color-text-muted`     | `#9CA3AF`                 | Xám nhạt         | Placeholder, captions                       |
| `--color-border`         | `#E5E7EB`                 | Xám border       | Đường kẻ, card borders                      |

### ⛔ KHÔNG sử dụng Gradient

- **TUYỆT ĐỐI KHÔNG** dùng `linear-gradient`, `radial-gradient` hay bất kỳ gradient nào
- Tất cả backgrounds, buttons, text đều dùng **màu solid (phẳng)**
- Tạo depth bằng **shadow**, **opacity**, **border** thay vì gradient
- Headings nổi bật dùng `color: #17409A` trực tiếp, KHÔNG dùng gradient text

---

## ✍️ Typography

### Font chữ

- **Heading**: `'Fredoka'` từ Google Fonts — rounded, friendly, phù hợp trẻ em nhưng vẫn sang trọng
- **Body**: `'Inter'` hoặc `'Geist Sans'` (đã có) — clean, dễ đọc
- **Accent/Fun**: `'Baloo 2'` — cho taglines, badges vui nhộn

### Kích thước

| Cấp   | Class                   | Kích thước         | Dùng cho                   |
| ----- | ----------------------- | ------------------ | -------------------------- |
| Hero  | `text-6xl` → `text-8xl` | 3.75rem → 6rem     | Hero banners, landing page |
| H1    | `text-4xl` → `text-5xl` | 2.25rem → 3rem     | Page titles                |
| H2    | `text-3xl` → `text-4xl` | 1.875rem → 2.25rem | Section titles             |
| H3    | `text-xl` → `text-2xl`  | 1.25rem → 1.5rem   | Card titles, sub-sections  |
| Body  | `text-base`             | 1rem               | Paragraph text             |
| Small | `text-sm`               | 0.875rem           | Captions, labels, meta     |
| Tiny  | `text-xs`               | 0.75rem            | Badges, tags               |

---

## 📐 Layout & Spacing

### Container

```
max-w-screen-2xl mx-auto px-8 md:px-16
```

### Spacing scale

- **Section gap**: `py-20` → `py-32` (80px → 128px)
- **Component gap**: `gap-8` → `gap-16` (32px → 64px)
- **Card padding**: `p-6` → `p-8` (24px → 32px)
- **Element gap**: `gap-3` → `gap-6` (12px → 24px)

### Border radius

- **Cards**: `rounded-2xl` → `rounded-3xl` (16px → 24px) — bo tròn mềm mại, thân thiện trẻ em
- **Buttons**: `rounded-2xl` (16px) hoặc `rounded-full` cho icon buttons
- **Images**: `rounded-2xl` → `rounded-3xl`
- **Inputs**: `rounded-2xl` (16px)

---

## 🧩 Quy tắc thiết kế Component

### Cards (Sản phẩm, Bộ sưu tập)

```
- Nền: bg-white
- Shadow: shadow-lg hover:shadow-2xl
- Border radius: rounded-3xl
- Transition: transition-all duration-300
- Hover: scale-[1.02] hoặc translateY(-8px)
- Hình ảnh: rounded-2xl, object-cover, aspect-square
- Badge góc: absolute top-4 right-4, rounded-full, px-3 py-1
```

### Buttons

```
Primary:    bg-[#17409A] text-white rounded-2xl px-8 py-4 font-bold shadow-xl hover:shadow-2xl hover:bg-[#0E2A66]
Secondary:  bg-white border-2 border-[#17409A] text-[#17409A] rounded-2xl px-8 py-4 font-bold hover:bg-[#17409A] hover:text-white
Accent:     bg-[#FF8C42] text-white rounded-2xl px-8 py-4 font-bold hover:bg-[#e07a35] (cho CTA trẻ em)
Icon:       w-12 h-12 rounded-full bg-[#17409A]/10 text-[#17409A] flex items-center justify-center transition-all hover:bg-[#17409A] hover:text-white
```

### Navigation

```
- Nền: bg-white/70 backdrop-blur-sm
- Fixed top, centered, rounded-2xl
- Dropdown: bg-white rounded-lg shadow-lg
- Active link: text-[#17409A] font-bold
- Hover: hover:text-[#17409A] hoặc hover:text-blue-600
```

### Sections

```
- Alternate giữa bg-white và bg-[#F4F7FF] để tạo rhythm
- Dùng decorative elements nhẹ nhàng: bear paw prints, stars, clouds
- Section dividers: curved/wave SVG hoặc đường kẻ mỏng với opacity
- Tạo depth bằng shadow và spacing, KHÔNG dùng gradient orbs
```

---

## 🧱 Component Architecture — BẮT BUỘC chia nhỏ

### Nguyên tắc TUYỆT ĐỐI

> **MỌI trang đều PHẢI được chia thành các component nhỏ.** KHÔNG ĐƯỢC viết toàn bộ nội dung trong 1 file `page.tsx`. File `page.tsx` chỉ đóng vai trò **orchestrator** — import và sắp xếp các component.

### Cấu trúc file cho mỗi trang

```
src/
├── app/[tên-trang]/
│   └── page.tsx                ← CHỈ import + layout, KHÔNG chứa logic/UI phức tạp
└── components/[tên-trang]/
    ├── HeroSection.tsx         ← Mỗi section là 1 component riêng
    ├── ProductGrid.tsx
    ├── FilterSidebar.tsx
    └── ...
```

### Quy tắc chia component

1. **Mỗi section trên trang = 1 component riêng** (Hero, Features, Products, Testimonials...)
2. **Mỗi UI pattern lặp lại = 1 component riêng** (ProductCard, ReviewCard, Badge...)
3. **Mỗi form = 1 component riêng** (LoginForm, SearchForm, NewsletterForm...)
4. **Mỗi interactive element phức tạp = 1 component riêng** (Dropdown, Modal, Tabs...)
5. **File `page.tsx` tối đa ~30-50 dòng** — chỉ import và render components

### Ví dụ `page.tsx` đúng chuẩn

```tsx
// ✅ ĐÚNG — page.tsx chỉ là orchestrator
import HeroSection from "@/src/components/home/HeroSection";
import FeaturedProducts from "@/src/components/home/FeaturedProducts";
import HowItWorks from "@/src/components/home/HowItWorks";
import Testimonials from "@/src/components/home/Testimonials";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <HowItWorks />
      <Testimonials />
    </>
  );
}
```

### ❌ SAI — KHÔNG viết như thế này

```tsx
// ❌ SAI — mọi thứ gom vào 1 file
export default function HomePage() {
  return <div>{/* 500+ dòng HTML/JSX ở đây */}</div>;
}
```

### Đặt tên component

- **PascalCase**: `HeroSection`, `ProductCard`, `FilterSidebar`
- **Tên mô tả rõ ràng**: Đọc tên phải biết component làm gì
- **Folder theo trang**: `components/home/`, `components/products/`, `components/auth/`
- **Component dùng chung**: `components/shared/` hoặc `components/ui/`

---

## ✨ Animation Guidelines (GSAP) — Mượt mà, tinh tế, KHÔNG lố

### Triết lý animation

> Animation phải **tự nhiên như hơi thở** — người dùng cảm nhận được sự mượt mà nhưng không chú ý đến animation. Nếu người dùng thấy "wow animation đẹp quá" thì có thể đã quá lố. Animation đúng là khi bỏ đi thì trang cảm thấy thiếu gì đó.

### Nguyên tắc BẮT BUỘC

1. **Subtle trước tiên**: Dịch chuyển tối đa `20-30px`, KHÔNG dịch `50px+`
2. **Opacity là chủ đạo**: Hầu hết animation chỉ cần fade-in là đủ
3. **Duration ngắn**: `0.4s → 0.6s` cho elements nhỏ, tối đa `0.8s` cho sections lớn
4. **Ease tự nhiên**: Dùng `power2.out` hoặc `power3.out`, TRÁNH `back.out` với giá trị bouncy lớn
5. **KHÔNG bounce quá mức**: Không dùng `elastic`, không scale quá `1.05`
6. **KHÔNG float/loop liên tục**: Tránh `yoyo: true, repeat: -1` trừ khi rất cần thiết và rất nhẹ
7. **Stagger nhẹ**: `0.08s → 0.1s` giữa mỗi item, KHÔNG `0.15s+`
8. **ScrollTrigger**: Dùng `once: true` để animation chỉ chạy 1 lần khi vào viewport

### ❌ TRÁNH hoàn toàn

- ❌ `scale: 0.5` → `scale: 1` (quá dramatic)
- ❌ `y: 100` (dịch chuyển quá xa)
- ❌ `rotation` trên text hoặc cards
- ❌ `elastic.out` ease
- ❌ Nhiều animation chạy cùng lúc trên cùng element
- ❌ Animation blocking user interaction

### ✅ Animation patterns chuẩn

```javascript
// Fade up nhẹ nhàng khi scroll (PATTERN CHÍNH)
gsap.fromTo(
  element,
  { y: 20, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 0.5,
    ease: "power2.out",
    scrollTrigger: {
      trigger: element,
      start: "top 85%",
      once: true, // Chỉ chạy 1 lần
    },
  },
);

// Fade in đơn giản (cho images, cards)
gsap.fromTo(
  element,
  { opacity: 0 },
  { opacity: 1, duration: 0.4, ease: "power2.out" },
);

// Stagger nhẹ cho list/grid items
gsap.fromTo(
  items,
  { y: 15, opacity: 0 },
  {
    y: 0,
    opacity: 1,
    duration: 0.4,
    stagger: 0.08,
    ease: "power2.out",
    scrollTrigger: { trigger: container, start: "top 80%", once: true },
  },
);

// Header entrance (chỉ 1 lần khi load trang)
gsap.fromTo(
  header,
  { y: -20, opacity: 0 },
  { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
);

// Hover scale tinh tế (CSS transition, không cần GSAP)
// hover:scale-[1.02] transition-transform duration-200
```

### Khi nào dùng GSAP vs CSS transition?

| Dùng GSAP                    | Dùng CSS transition       |
| ---------------------------- | ------------------------- |
| ScrollTrigger (vào viewport) | Hover effects đơn giản    |
| Stagger nhiều elements       | Color changes             |
| Entrance animation phức tạp  | Scale nhỏ (1.02-1.05)     |
| Timeline (nhiều bước)        | Opacity thay đổi đơn giản |

---

## 🎭 Yếu tố trang trí đặc trưng

### Phải có trong mỗi page:

1. **Bear-related decorations**: paw prints, bear silhouettes, stars, hearts (dùng opacity nhẹ)
2. **Wave/curved dividers** giữa các sections (SVG solid color, không gradient)
3. **Subtle shadows** để tạo depth thay vì gradient orbs
4. **Glassmorphism nhẹ** cho navbar (`bg-white/70 backdrop-blur-sm`)

### Iconography

- Ưu tiên dùng **react-icons** (Ionicons 5 + Game Icons)
- Icon style: **outline** cho UI icons, **filled** cho decorative/accent
- Bear icon (`GiBearFace`) là biểu tượng thường xuyên xuất hiện

---

## 📱 Responsive Design

| Breakpoint | Prefix  | Behavior                               |
| ---------- | ------- | -------------------------------------- |
| < 640px    | default | 1 cột, compact spacing, hamburger menu |
| ≥ 640px    | `sm:`   | 2 cột cho grids                        |
| ≥ 768px    | `md:`   | Header đầy đủ, 2-3 cột                 |
| ≥ 1024px   | `lg:`   | 3-4 cột, spacing rộng                  |
| ≥ 1280px   | `xl:`   | Layout tối đa                          |
| ≥ 1536px   | `2xl:`  | Max-width container                    |

### Mobile-first rules:

- Touch targets tối thiểu `44px × 44px`
- Font size không nhỏ hơn `14px` trên mobile
- Images phải responsive với `object-cover`
- Ẩn decorative elements phức tạp trên mobile

---

## 🏗️ Cấu trúc trang khuyến nghị

### Trang chủ (Home)

1. **Hero Section**: Banner lớn với gấu bông 3D/illustration, tagline, CTA
2. **Featured Products**: Grid sản phẩm nổi bật
3. **How It Works**: 3-4 bước giải thích IoT/AI (icon + text)
4. **Collections**: Showcase bộ sưu tập theo mùa/chủ đề
5. **Testimonials**: Reviews từ phụ huynh
6. **Newsletter + Footer**: (đã có)

### Trang sản phẩm (Products)

1. **Filter sidebar**: Lọc theo loại, giá, tuổi, tính năng
2. **Product grid**: Cards với hình, tên, giá, rating, badge "AI" / "IoT"
3. **Quick view modal**: Xem nhanh sản phẩm

### Trang chi tiết sản phẩm (Product Detail)

1. **Image gallery**: Slider hình ảnh lớn
2. **Product info**: Tên, giá, mô tả, tính năng IoT/AI
3. **Customization**: Chọn màu, kích thước, phụ kiện
4. **Reviews**: Đánh giá từ người dùng
5. **Related products**: Sản phẩm liên quan

---

## ⚠️ Những điều CẦN TRÁNH

1. ❌ **GRADIENT** — TUYỆT ĐỐI KHÔNG dùng gradient ở bất kỳ đâu
2. ❌ **Animation lố** — Không bounce, không elastic, không float lặp lại, không scale lớn
3. ❌ Màu sắc đơn điệu — PHẢI có color accents bằng màu solid
4. ❌ Layout phẳng, grid đều đặn — PHẢI có sections phá cách, overlapping elements
5. ❌ Design quá "adult" hoặc quá "corporate" — Phải vui tươi nhưng sang trọng
6. ❌ Design quá "childish" — Không dùng quá nhiều màu sặc sỡ, giữ sự tinh tế
7. ❌ Placeholder images — Luôn dùng generate_image tool để tạo hình ảnh thực
8. ❌ Font hệ thống mặc định — Luôn import Google Fonts phù hợp
9. ❌ Nút bấm, card không có hover effect — MỌI interactive element phải có transition
10. ❌ Animation chạy nhiều lần — Dùng `once: true` trong ScrollTrigger

---

## � Data & Type Separation — BẮT BUỘC tách ra ngoài component

### Nguyên tắc TUYỆT ĐỐI

> **KHÔNG BAO GIỜ** đặt mock data, constant arrays hay TypeScript types/interfaces trực tiếp bên trong file component. Mọi data và type phải nằm ở file riêng để dễ tái sử dụng, dễ thay thế bằng API thật sau này.

### Cấu trúc thư mục

```
src/
├── data/
│   ├── products.ts       ← Mock products array
│   ├── collections.ts    ← Mock collections
│   └── ...               ← Mỗi domain có 1 file riêng
├── types/
│   ├── products.ts       ← ProductItem, Category, SortOption, ProductsClientProps
│   ├── collections.ts    ← CollectionItem, ...
│   ├── responses.ts      ← API response types
│   ├── requests.ts       ← API request types
│   └── index.ts          ← Re-export tất cả: export * from "./products"; ...
└── components/
    └── products/
        └── ProductsClient.tsx   ← CHỈ import, KHÔNG chứa data/type
```

### Quy tắc đặt file

| Loại                                   | Đặt ở                                     | Ví dụ                                           |
| -------------------------------------- | ----------------------------------------- | ----------------------------------------------- |
| Mock / static data arrays              | `src/data/*.ts`                           | `src/data/products.ts`                          |
| Interface / Type / Enum cho 1 domain   | `src/types/*.ts`                          | `src/types/products.ts`                         |
| Props interface của component          | `src/types/*.ts` (cùng file domain)       | `ProductsClientProps` trong `types/products.ts` |
| Constant options (categories, sort...) | `src/data/*.ts` hoặc `src/constants/*.ts` | `CATEGORIES`, `SORT_OPTIONS`                    |
| Re-export tổng hợp                     | `src/types/index.ts`                      | `export * from "./products"`                    |

### ❌ SAI — KHÔNG viết như thế này

```tsx
// ❌ ProductsClient.tsx
const ALL_PRODUCTS = [
  { id: "bear-1", name: "Gấu Nâu", price: 450000, ... },
  ...
];

type Category = "all" | "bear" | "accessory";

interface ProductsClientProps {
  initialCategory?: string;
}

export default function ProductsClient({ initialCategory }: ProductsClientProps) { ... }
```

### ✅ ĐÚNG — tách ra file riêng

```tsx
// ✅ src/data/products.ts
import { type ProductItem } from "@/types/products";
export const ALL_PRODUCTS: ProductItem[] = [ ... ];

// ✅ src/types/products.ts
export type Category = "all" | "bear" | "accessory";
export interface ProductsClientProps { initialCategory?: string; }

// ✅ src/types/index.ts
export * from "./products";

// ✅ ProductsClient.tsx — chỉ import
import { type SortOption, type ProductsClientProps } from "@/types/products";
import { ALL_PRODUCTS } from "@/data/products";
export default function ProductsClient({ initialCategory }: ProductsClientProps) { ... }
```

### Khi nào được phép để inline?

- **Chỉ** khi data/type đó **chỉ dùng duy nhất trong 1 component** VÀ **quá nhỏ** (≤ 3 items, ≤ 5 dòng)
- Ví dụ: `const tabs = ["Tất cả", "Mới nhất"]` trong 1 component tab nhỏ — có thể chấp nhận
- Nếu sau này cần dùng ở nơi khác → phải chuyển ra ngay lập tức

---

## �🔐 Auth Pages (Login / Register / Forgot Password)

### Cấu trúc file

```
src/
├── app/auth/page.tsx            # Orchestrator — chỉ chứa layout, import AuthCard
└── components/auth/
    ├── AuthCard.tsx             # Card wrapper + GSAP animation controller
    ├── LoginForm.tsx            # Form đăng nhập
    ├── RegisterForm.tsx         # Form đăng ký
    ├── ForgotForm.tsx           # Form quên mật khẩu
    ├── InputField.tsx           # Input có icon + toggle show/hide password
    └── SocialButtons.tsx        # Google + Facebook + divider
```

### Card Style

```
bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl shadow-[#17409A]/10
max-w-md px-10 py-10
```

> Nền trắng **70% opacity** + **backdrop-blur-xl** — background blobs hiện qua

### Background Layout

- `/login-background.png` (pastel blob theme) fill toàn trang — `object-cover`
- Left `w-full lg:w-[48%]` → AuthCard
- Right `hidden lg:flex flex-1` → teddy bear float + brand text

### Animation Pattern (GSAP)

```js
// Exit: fly UP
gsap.to(fields, {
  y: -36,
  opacity: 0,
  duration: 0.25,
  stagger: 0.04,
  ease: "power2.in",
});
// Sau đó setMode(next)

// Enter: fly IN từ dưới (trong useEffect[mode])
gsap.set(fields, { y: 36, opacity: 0 });
gsap.to(fields, {
  y: 0,
  opacity: 1,
  duration: 0.38,
  stagger: 0.07,
  ease: "power2.out",
});
```

- Mỗi section trong form phải có class **`field-item`** để GSAP target đúng
- Dùng `isAnimating` ref để tránh click spam gây animation glitch

### Font & Rules

- Font: **Nunito** (700/800/900) với Vietnamese subset — KHÔNG dùng Fredoka cho tiếng Việt
- ❌ Không để toàn bộ logic trong 1 file page.tsx — tách từng form ra component
- ❌ Card KHÔNG dùng nền tối — glassmorphism trắng + blur
- ✅ Social login (Google + Facebook) có mặt ở cả 3 mode
