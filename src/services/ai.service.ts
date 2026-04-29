class AIService {
  /**
   * Ghép ảnh phụ kiện lên ảnh gấu gốc bằng HTML5 Canvas (100% miễn phí, không cần AI API)
   */
  async generateProductCombo(
    baseImageUrl: string,
    combinationKey: string,
    accessoryNames: string[],
    accessoryImageUrls: string[] = []
  ): Promise<{ url: string } | null> {
    try {
      const canvas = document.createElement('canvas');
      const SIZE = 1024;
      canvas.width = SIZE;
      canvas.height = SIZE;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      // Vẽ ảnh gấu gốc lên nền canvas
      const bearImg = await this.loadImage(baseImageUrl);
      ctx.drawImage(bearImg, 0, 0, SIZE, SIZE);

      // Vị trí đặt phụ kiện trên canvas (tỷ lệ theo kích thước canvas)
      // Thứ tự: Đầu → Cổ/Vai trái → Cạnh phải → Tay/Chân
      const POSITIONS = [
        { x: 0.25, y: 0.02, w: 0.5,  h: 0.45 }, // Trên đầu (mũ)
        { x: 0.0,  y: 0.35, w: 0.45, h: 0.45 }, // Vai/cạnh trái (túi)
        { x: 0.55, y: 0.35, w: 0.45, h: 0.45 }, // Cạnh phải
        { x: 0.2,  y: 0.6,  w: 0.6,  h: 0.38 }, // Bụng/thân dưới
        { x: 0.1,  y: 0.2,  w: 0.4,  h: 0.35 }, // Vai trái trên
        { x: 0.5,  y: 0.2,  w: 0.4,  h: 0.35 }, // Vai phải trên
      ];

      // Vẽ từng ảnh phụ kiện lên canvas
      for (let i = 0; i < accessoryImageUrls.length; i++) {
        const imgUrl = accessoryImageUrls[i];
        if (!imgUrl) continue;

        const pos = POSITIONS[i % POSITIONS.length];
        try {
          const accImg = await this.loadImage(imgUrl);
          const px = pos.x * SIZE;
          const py = pos.y * SIZE;
          const pw = pos.w * SIZE;
          const ph = pos.h * SIZE;

          // Giữ tỷ lệ ảnh phụ kiện
          const aspectRatio = accImg.width / accImg.height;
          let drawW = pw;
          let drawH = pw / aspectRatio;
          if (drawH > ph) {
            drawH = ph;
            drawW = ph * aspectRatio;
          }
          const offsetX = px + (pw - drawW) / 2;
          const offsetY = py + (ph - drawH) / 2;

          ctx.drawImage(accImg, offsetX, offsetY, drawW, drawH);
        } catch (e) {
          console.warn(`Không thể tải ảnh phụ kiện: ${imgUrl}`);
        }
      }

      // Thêm watermark nhỏ ở góc
      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.fillText('Design a Bear', 16, SIZE - 16);

      return { url: canvas.toDataURL('image/png', 0.95) };
    } catch (error: any) {
      console.error("Canvas Composite Error:", error.message);
      return null;
    }
  }

  /**
   * Tải ảnh từ URL thành HTMLImageElement
   */
  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Cho phép tải ảnh từ domain khác
      img.onload = () => resolve(img);
      img.onerror = () => {
        // Nếu lỗi CORS, thử lại không có crossOrigin
        const img2 = new Image();
        img2.onload = () => resolve(img2);
        img2.onerror = reject;
        img2.src = url;
      };
      img.src = url;
    });
  }
}

export const aiService = new AIService();
