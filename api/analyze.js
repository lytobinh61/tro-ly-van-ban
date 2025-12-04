// /api/analyze.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { code } = req.body || {};
    if (!code) {
      return res.status(400).json({ error: "Thiếu số hiệu văn bản" });
    }

    const normalized = code
      .toUpperCase()
      .replace(/Đ/g, "D")
      .replace(/[^A-Z0-9/\\-]/g, "")
      .trim();

    // =======================
    // 1️⃣ Thử nguồn LuatVietnam.vn
    // =======================
    const urlLVN = `https://data.luatvietnam.vn/vb/${encodeURIComponent(
      normalized
    )}`;
    const lvn = await tryFetch(urlLVN, "LuatVietnam.vn");

    if (lvn.success) {
      return res.status(200).json(lvn.data);
    }

    // =======================
    // 2️⃣ Thử nguồn ThuVienPhapLuat.vn
    // =======================
    const urlTVPL = `https://thuvienphapluat.vn/van-ban/${encodeURIComponent(
      normalized
    )}`;
    const tvpl = await tryFetch(urlTVPL, "ThuVienPhapLuat.vn");

    if (tvpl.success) {
      return res.status(200).json(tvpl.data);
    }

    // =======================
    // 3️⃣ Fallback: VBPL.vn (nếu 2 nguồn kia lỗi)
    // =======================
    const urlVBPL = `https://vbpl.vn/TW/Pages/vbpq-toanvan.aspx?keyword=${encodeURIComponent(
      normalized
    )}`;
    const vbpl = await tryFetch(urlVBPL, "VBPL.vn");

    if (vbpl.success) {
      return res.status(200).json(vbpl.data);
    }

    // ❌ Nếu tất cả đều thất bại
    return res.status(404).json({
      error: `Không tìm thấy dữ liệu cho ${normalized}. Hãy thử nhập lại chính xác số hiệu.`,
    });
  } catch (err) {
    console.error("❌ Lỗi hệ thống:", err);
    return res
      .status(500)
      .json({ error: "Lỗi khi tra cứu dữ liệu pháp luật. Vui lòng thử lại." });
  }
}

// ===============================
// 🔧 Hàm phụ: tải và phân tích HTML
// ===============================
async function tryFetch(url, source) {
  try {
    const htmlResponse = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36",
        "Accept-Language": "vi,en;q=0.9",
      },
    });

    if (!htmlResponse.ok) {
      console.warn(`⚠️ ${source} phản hồi lỗi: ${htmlResponse.status}`);
      return { success: false };
    }

    const html = await htmlResponse.text();
    const result = parseHTML(html, source, url);
    return { success: !!result.title, data: result };
  } catch (e) {
    console.warn(`⚠️ Lỗi truy cập ${source}:`, e.message);
    return { success: false };
  }
}

// ===============================
// 🧠 Hàm phân tích HTML theo từng nguồn
// ===============================
function parseHTML(html, source, link) {
  const data = {
    title: "",
    code: "",
    type: "",
    agency: "",
    signDate: "",
    effectiveDate: "",
    status: "",
    source,
    link,
  };

  try {
    if (source.includes("LuatVietnam")) {
      data.title =
        html.match(/<h1[^>]*>(.*?)<\/h1>/i)?.[1]?.trim() ||
        "Không rõ tiêu đề";
      data.agency =
        html.match(/Cơ quan ban hành[^:]*:\s*<\/b>([^<]*)</i)?.[1]?.trim() ||
        "Không rõ";
      data.signDate =
        html.match(/Ngày ban hành[^:]*:\s*<\/b>([^<]*)</i)?.[1]?.trim() ||
        "Không rõ";
      data.effectiveDate =
        html.match(/Ngày có hiệu lực[^:]*:\s*<\/b>([^<]*)</i)?.[1]?.trim() ||
        "Không rõ";
      data.status =
        html.match(/Tình trạng[^:]*:\s*<\/b>([^<]*)</i)?.[1]?.trim() ||
        "Không rõ";
    } else if (source.includes("ThuVienPhapLuat")) {
      data.title =
        html.match(/<h1[^>]*>(.*?)<\/h1>/i)?.[1]?.trim() ||
        "Không rõ tiêu đề";
      data.agency =
        html.match(/Ban hành bởi[^<]*<\/strong>\s*([^<]*)</i)?.[1]?.trim() ||
        "Không rõ";
      data.signDate =
        html.match(/Ngày ban hành[^:]*<\/strong>\s*([^<]*)</i)?.[1]?.trim() ||
        "Không rõ";
      data.effectiveDate =
        html.match(/Ngày có hiệu lực[^:]*<\/strong>\s*([^<]*)</i)?.[1]?.trim() ||
        "Không rõ";
      data.status =
        html.match(/Tình trạng[^:]*<\/strong>\s*([^<]*)</i)?.[1]?.trim() ||
        "Không rõ";
    } else if (source.includes("VBPL")) {
      data.title =
        html.match(/<title[^>]*>(.*?)<\/title>/i)?.[1]?.trim() ||
        "Không rõ tiêu đề";
      data.agency =
        html.match(/Cơ quan ban hành[^:]*:\s*<\/b>([^<]*)</i)?.[1]?.trim() ||
        "Không rõ";
      data.signDate =
        html.match(/Ngày ban hành[^:]*:\s*<\/b>([^<]*)</i)?.[1]?.trim() ||
        "Không rõ";
      data.effectiveDate =
        html.match(/Ngày có hiệu lực[^:]*:\s*<\/b>([^<]*)</i)?.[1]?.trim() ||
        "Không rõ";
      data.status =
        html.match(/Tình trạng hiệu lực[^:]*:\s*<\/b>([^<]*)</i)?.[1]?.trim() ||
        "Không rõ";
    }
  } catch (e) {
    console.warn(`⚠️ Lỗi phân tích ${source}:`, e.message);
  }

  return data;
}
