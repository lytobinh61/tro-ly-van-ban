// /api/analyze.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { code } = req.body || {};
    if (!code)
      return res
        .status(400)
        .json({ error: "Thiếu số hiệu văn bản (VD: 15/2023/ND-CP)" });

    // 🔧 Chuẩn hóa mã văn bản: bỏ dấu, viết hoa
    const normalized = code
      .toUpperCase()
      .replace(/Đ/g, "D")
      .replace(/[^A-Z0-9/\\-]/g, "");

    // 🌐 Tạo URL tìm kiếm VBPL (theo từ khóa)
    const searchUrl = `https://vbpl.vn/TW/Pages/vbpq-toanvan.aspx?keyword=${encodeURIComponent(
      normalized
    )}`;

    // ⏳ Thử truy cập VBPL.vn
    const response = await fetch(searchUrl, { method: "GET" });
    const html = await response.text();

    // ❌ Nếu không tìm thấy hoặc lỗi hiển thị
    if (!html || html.includes("Không tìm thấy văn bản")) {
      return res.status(404).json({
        error: `Không tìm thấy dữ liệu cho ${normalized}.`,
      });
    }

    // 🧠 Trích xuất sơ bộ tiêu đề văn bản
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    const title =
      titleMatch && titleMatch[1]
        ? titleMatch[1].replace(/[\n\r\t]/g, "").trim()
        : `Văn bản ${normalized}`;

    // 🧾 Trích xuất thông tin ngày ban hành
    const dateMatch = html.match(/Ngày ban hành[^:]*:\s*<\/b>([^<]*)</i);
    const signDate = dateMatch ? dateMatch[1].trim() : "Không rõ";

    // 🧾 Trích xuất tình trạng hiệu lực
    const statusMatch = html.match(/Tình trạng hiệu lực[^:]*:\s*<\/b>([^<]*)</i);
    const status = statusMatch ? statusMatch[1].trim() : "Không rõ";

    // 🧾 Trích xuất cơ quan ban hành
    const agencyMatch = html.match(/Cơ quan ban hành[^:]*:\s*<\/b>([^<]*)</i);
    const agency = agencyMatch ? agencyMatch[1].trim() : "Không rõ";

    // 🧾 Trích xuất ngày hiệu lực
    const effMatch = html.match(/Ngày có hiệu lực[^:]*:\s*<\/b>([^<]*)</i);
    const effectiveDate = effMatch ? effMatch[1].trim() : "Không rõ";

    // ✅ Trả về dữ liệu cho front-end
    return res.status(200).json({
      code: normalized,
      title,
      signDate,
      status,
      agency,
      effectiveDate,
      link: searchUrl,
      source: "vbpl.vn",
    });
  } catch (err) {
    console.error("❌ Lỗi khi truy cập VBPL.vn:", err);
    return res.status(500).json({
      error:
        "Không thể kết nối VBPL.vn (máy chủ VBPL có thể đang bận). Vui lòng thử lại sau.",
    });
  }
}
