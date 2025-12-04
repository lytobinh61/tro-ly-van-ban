// /api/analyze.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    // Chỉ chấp nhận POST
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { code } = req.body || {};

    if (!code) {
      return res.status(400).json({ error: "Thiếu số hiệu văn bản" });
    }

    // ⚙️ Dữ liệu giả lập cho bản demo
    const data = {
      code,
      summary: "Nghị định này quy định chi tiết về quản lý, kiểm tra và xử lý vi phạm hành chính trong lĩnh vực tương ứng.",
      scope: "Áp dụng cho các cơ quan, tổ chức và cá nhân có liên quan trong phạm vi toàn quốc.",
      effect: "Có hiệu lực từ ngày 01/01/2024.",
      basis: "Căn cứ Luật Tổ chức Chính phủ và các văn bản pháp luật liên quan.",
    };

    return res.status(200).json(data);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
