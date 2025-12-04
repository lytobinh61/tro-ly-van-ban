// ✅ /api/analyze.js — version chạy chắc chắn trên Vercel
export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json();
    const { code } = body || {};

    if (!code) {
      return new Response(JSON.stringify({ error: "Thiếu số hiệu văn bản" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ⚙️ Dữ liệu mẫu giả lập
    const data = {
      code,
      summary: "Nghị định này quy định chi tiết về quản lý, kiểm tra và xử lý vi phạm hành chính trong lĩnh vực tương ứng.",
      scope: "Áp dụng cho các cơ quan, tổ chức và cá nhân có liên quan trong phạm vi toàn quốc.",
      effect: "Có hiệu lực từ ngày 01/01/2024.",
      basis: "Căn cứ Luật Tổ chức Chính phủ và các văn bản pháp luật liên quan.",
    };

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
