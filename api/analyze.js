export default async function handler(req, res) {
  // ✅ Chỉ cho phép POST
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ error: "Phương thức không hợp lệ. Chỉ hỗ trợ POST." });
  }

  try {
    const { code } = req.body || {};
    if (!code) {
      return res.status(400).json({ error: "Vui lòng nhập số hiệu văn bản." });
    }

    // 🔹 Chuẩn hóa số hiệu văn bản
    const cleanCode = code.trim().toUpperCase().replace(/[–—]/g, "-");
    const encoded = encodeURIComponent(cleanCode);

    // 🔹 3 nguồn dữ liệu chính
    const sources = [
      {
        name: "Luật Việt Nam",
        url: `https://vanban-phapluat.lytobinh61.workers.dev/?url=https://luatvietnam.vn/${encoded}.html`,
      },
      {
        name: "Thư viện Pháp luật",
        url: `https://vanban-phapluat.lytobinh61.workers.dev/?url=https://thuvienphapluat.vn/${encoded}.html`,
      },
      {
        name: "Data Luật Việt Nam",
        url: `https://vanban-phapluat.lytobinh61.workers.dev/?url=https://data.luatvietnam.vn/${encoded}.html`,
      },
    ];

    let found = null;
    let foundSource = null;

    // 🔹 Tìm dữ liệu hợp lệ từ từng nguồn
    for (const s of sources) {
      try {
        const resp = await fetch(s.url);
        if (!resp.ok) continue;

        const html = await resp.text();

        // Chỉ chấp nhận nếu có các cụm đặc trưng của văn bản pháp luật
        if (
          html.includes("Nghị định") ||
          html.includes("Thông tư") ||
          html.includes("Quyết định") ||
          html.includes("Văn bản hợp nhất")
        ) {
          found = html;
          foundSource = s;
          break;
        }
      } catch (_) {}
    }

    // 🔹 Nếu không tìm thấy ở bất kỳ nguồn nào
    if (!found) {
      return res.status(404).json({
        error: `Không tìm thấy dữ liệu cho ${code}. 
Hãy đảm bảo bạn nhập đúng định dạng (ví dụ: 15/2023/NĐ-CP, 12/2022/TT-BTC, 23/2021/QĐ-TTg).`,
      });
    }

    // 🔹 Làm sạch nội dung HTML, giữ phần quan trọng
    const textOnly = found
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // 🔹 Cắt phần đầu để hiển thị ngắn gọn
    const snippet = textOnly.slice(0, 1200) + "...";

    // ✅ Trả về kết quả JSON
    return res.status(200).json({
      code,
      source: foundSource.name,
      summary: "Đã truy xuất thành công dữ liệu văn bản pháp luật.",
      snippet,
      originalUrl: foundSource.url,
    });
  } catch (err) {
    console.error("❌ Lỗi khi xử lý:", err);
    return res.status(500).json({
      error: "Lỗi máy chủ: " + err.message,
      hint: "Vui lòng thử lại sau vài phút.",
    });
  }
}
