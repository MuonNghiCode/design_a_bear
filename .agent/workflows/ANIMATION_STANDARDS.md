# ✨ Animation Standards (GSAP)

Triết lý: Animation phải **tự nhiên như hơi thở** — mượt mà nhưng không gây chú ý quá mức.

## 📏 Nguyên tắc BẮT BUỘC

1. **Subtle (Tinh tế)**: Dịch chuyển nhỏ (20-30px), không bay quá xa.
2. **Opacity**: Hầu hết animation nên kết hợp với fade-in.
3. **Duration**: 
   - Elements nhỏ: `0.4s → 0.6s`.
   - Sections lớn: Tối đa `0.8s`.
4. **Easing**: Ưu tiên `power2.out` hoặc `power3.out`. TRÁNH các hiệu ứng bouncy quá mạnh.
5. **ScrollTrigger**: Luôn sử dụng `once: true` để tránh lặp lại animation gây khó chịu khi cuộn lên xuống.

## 🛠️ Animation Patterns chuẩn

### Fade Up (Dùng nhiều nhất)
```js
gsap.fromTo(element, 
  { y: 20, opacity: 0 }, 
  { y: 0, opacity: 1, duration: 0.5, ease: "power2.out", scrollTrigger: { trigger: element, once: true } }
);
```

### Staggered List
```js
gsap.fromTo(items, 
  { y: 15, opacity: 0 }, 
  { y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: "power2.out" }
);
```

## 🚫 Những điều CẦN TRÁNH

- ❌ `scale: 0.5` → `scale: 1` (quá dramatic).
- ❌ Rung lắc (Rotation) trên văn bản.
- ❌ Animation lặp lại vô tận (Loop) trừ các icon trang trí rất nhỏ.
- ❌ Animation làm chậm trải nghiệm người dùng (chặn tương tác).
