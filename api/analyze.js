// /api/analyze.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let { code } = req.body || {};
    if (!code) return res.status(400).json({ error: "Thiếu số hiệu văn bản" });

// Chuẩn hoá: bỏ dấu tiếng Việt và ký tự đặc biệt
  code = code
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .replace(/[Đđ]/g, "D")
  .replace(/\s+/g, "")
  .replace(/[^0-9A-Za-z\/\-]/g, "");

    }

    // Gọi API tìm kiếm VBPL (CSDL Quốc gia)
    const searchUrl = `https://vbpl.vn/TW/Pages/TimkiemVBPL.aspx?keyword=${encodeURIComponent(code)}&mode=0&Fields=&OrganID=&TypeID=&SignDateFrom=&SignDateTo=&PublishDateFrom=&PublishDateTo=&EffectiveDateFrom=&EffectiveDateTo=&DocStatusID=0&IsEffect=0&IsReplace=0&IsMerged=0&IsCancel=0`;
    const html = await fetch(searchUrl).then(r => r.text());

    // Dò ra ItemID đầu tiên trong HTML
    const match = html.match(/ItemID=(\d+)/);
    if (!match) {
      return res.status(404).json({ error: `Không tìm thấy dữ liệu cho ${code}` });
    }

    const itemId = match[1];
    const infoUrl = `https://vbpl.vn/TW/Pages/vbpq-thongtin.aspx?ItemID=${itemId}`;
    const infoHtml = await fetch(infoUrl).then(r => r.text());

    // Trích các trường chính (thường nằm trong <div class="infoContent">)
    const getText = (label) => {
      const regex = new RegExp(`<td[^>]*>${label}<\/td>\\s*<td[^>]*>(.*?)<\/td>`, "i");
      const m = infoHtml.match(regex);
      return m ? m[1].replace(/<[^>]+>/g, "").trim() : "";
    };

    const data = {
      code,
      title: getText("Tên văn bản") || "Không rõ tên văn bản",
      type: getText("Loại văn bản") || "",
      agency: getText("Cơ quan ban hành/Chủ thể ban hành") || "",
      signDate: getText("Ngày ban hành") || "",
      effectiveDate: getText("Ngày có hiệu lực") || "",
      status: getText("Tình trạng hiệu lực") || "",
      link: `https://vbpl.vn/TW/Pages/vbpq-toanvan.aspx?ItemID=${itemId}`,
    };

    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

