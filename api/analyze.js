export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Chỉ hỗ trợ phương thức POST." });
  }

  try {
    const { code } = req.body || {};
    if (!code) {
      return res.status(400).json({ error: "Thiếu số hiệu văn bản." });
    }

    const cleanCode = code.trim().toUpperCase().replace(/[–—]/g, "-");
    const encoded = encodeURIComponent(cleanCode);

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

    let html = null;
    let sourceName = null;
    let sourceUrl = null;

    for (const s of sources) {
      try {
        const resp = await fetch(s.url);
        if (!resp.ok) continue;
        const text = await resp.text();

        if (
          text.includes("Nghị định") ||
          text.includes("Thông tư") ||
          text.includes("Quyết định")
        ) {
          html = text;
          sourceName = s.name;
          sourceUrl = s.url;
          break;
        }
      } catch (_) {}
    }

    if (!html) {
      return res.status(404).json({
        error: `Không tìm thấy dữ liệu cho ${code}. 
Vui lòng nhập đúng định dạng (ví dụ: 15/2023/NĐ-CP, 12/2022/TT-BTC).`,
      });
    }

    // Trích thông tin cơ bản bằng regex
    const find = (regex) => {
      const m = html.match(regex);
      return m ? m[1].trim() : "Không rõ";
    };

    const info = {
      code,
      title: find(/<title>(.*?)<\/title>/i),
      type:
        find(/(Nghị định|Thông tư|Quyết định|Công văn)/i) || "Không rõ",
      agency: find(/(Bộ [^<]+|Chính phủ|Thủ tướng Chính phủ)/i),
      issued: find(/ngày\s*(\d{1,2}\/\d{1,2}\/\d{4})/i),
      effect: find(/hiệu lực từ ngày\s*(\d{1,2}\/\d{1,2}\/\d{4})/i),
      status:
        find(/(Còn hiệu lực|Hết hiệu lực|Ngưng hiệu lực|Bị thay thế)/i) ||
        "Không rõ",
      source: sourceName,
      link: sourceUrl,
    };

    return res.status(200).json(info);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
