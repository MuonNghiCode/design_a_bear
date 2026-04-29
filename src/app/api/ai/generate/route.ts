import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function POST(req: Request) {
  try {
    const { baseImageBase64, accessoryNames } = await req.json();
    const apiKey = process.env.GOOGLE_API_KEY;
    const listAcc = (accessoryNames as string[]).join(' và ');

    if (!apiKey) {
      return NextResponse.json({ error: "THIẾU GOOGLE_API_KEY trong .env" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const base64Data = baseImageBase64.split(',')[1];
    const mimeType = baseImageBase64.split(';')[0].split(':')[1] || 'image/jpeg';

    const prompt = `Đây là ảnh một con gấu bông. Hãy tạo ảnh mới trong đó con gấu này đang mặc ${listAcc}. Giữ nguyên khuôn mặt, màu lông của con gấu. Nền trắng, ảnh chụp studio chuyên nghiệp.`;

    const response = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash-image',
      config: {
        responseModalities: ['IMAGE', 'TEXT'],
      },
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: base64Data,
              }
            }
          ],
        },
      ],
    });

    // Gom tất cả chunk lại và tìm phần ảnh
    for await (const chunk of response) {
      if (!chunk.candidates?.[0]?.content?.parts) continue;

      for (const part of chunk.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const imageMime = part.inlineData.mimeType || 'image/png';
          return NextResponse.json({
            imageUrl: `data:${imageMime};base64,${part.inlineData.data}`
          });
        }
      }
    }

    return NextResponse.json({ error: "Gemini không tạo được ảnh. Thử lại sau." }, { status: 500 });

  } catch (error: any) {
    console.error("Gemini 2.5 Flash Image Error:", error.message);
    return NextResponse.json({
      error: error.message,
    }, { status: 500 });
  }
}
