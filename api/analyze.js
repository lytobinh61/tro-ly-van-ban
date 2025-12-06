// /api/analyze.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // ⚠️ Khai báo trong Vercel → Settings → Environment Variables
});

export default async function handler(req, res) {
  // ✅ Chỉ chấp nhận POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { code } = req.body || {};
    if (!code) {
      return res.status(400).json({ error: "Thiếu số hiệu văn bản pháp luật" });
    }

    // 🧠 Prompt gửi đến GPT
    const prompt = `
Bạn là chuyên gia pháp lý Việt Nam. 
Hãy phân tích và tóm tắt ngắn gọn văn bản pháp luật có số hiệu "${code}" theo các mục sau:
1️⃣ Nội dung chính (tóm tắt khoảng 3–4 câu)  
2️⃣ Phạm vi áp dụng (đối tượng và lĩnh vực)  
3️⃣ Hiệu lực thi hành (ngày có hiệu lực, văn bản bị thay thế nếu có)  
4️⃣ Căn cứ pháp lý và mối liên hệ với các văn bản khác.

Nếu không tìm thấy thông tin, trả về thông báo “Không tìm thấy thông tin hợp lệ cho văn bản ${code}”. 
Kết quả trả về bằng tiếng Việt, trình bày rõ ràng, dễ đọc.
`;

    // ⚙️ Gửi đến GPT
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Bạn là trợ lý pháp lý chuyên về văn bản Việt Nam." },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
    });

    const content = response.choices?.[0]?.message?.content || "Không có phản hồi từ GPT.";

    // ✅ Trả kết quả
    return res.status(200).json({
      code,
      analysis: content,
      source: "GPT-4o-mini",
    });
  } catch (error) {
    console.error("❌ Lỗi GPT:", error);
    return res.status(500).json({
      error: "Không thể kết nối GPT hoặc khóa API sai",
      detail: error.message,
    });
  }
}
