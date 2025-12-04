// /api/analyze.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    let { code } = req.body || {};
    if (!code) {
      return res.status(400).json({ error: "Thiếu số hiệu văn bản" });
    }

    // 🔧 Chuẩn hoá mã văn bản: bỏ dấu, ký tự lạ, viết hoa ND-CP...
    code = code
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[Đđ]/g, "D")
      .replace(/\s+/g, "")
      .replace(/[^0-9A-Za-z\/\-]/g, "")
      .toUpperCase();

    // 🧭 Gọi API tìm kiếm VBPL (CSDL Quốc gia)
    const searchUrl = `https://vbpl.vn/TW/Pages/TimkiemVBPL.aspx?keyword=${encodeURIComponent(
      code
    )}&mode=0`;
    const html = await fetch(searchUrl).then((r) => r.text());

    // 🔍 Dò ID văn bản đầu tiên
    const match = html.match(/ItemID=(\d+)/);
    if (!match) {
      return res
        .status(404)
        .json({
          error: `Không tìm thấy dữ liệu cho ${code}. Hãy thử nhập lại không dấu, ví dụ: 15/2023/ND-CP.`,
        });
    }

    const itemId = match[1];
    const infoUrl = `https://vbpl.vn/TW/Pages/vbpq-thongtin.aspx?ItemID=${itemId}`;
    const infoHtml = await fetch(infoUrl).then((r) => r.text());

    // 🧠 Hàm tiện ích để trích nội dung giữa 2 <td>
    const getText = (label) => {
      const regex = new RegExp(
        `<td[^>]*>${label}<\/td>\\s*<td[^>]*>(.*?)<\/td>`,
        "i"
      );
      const m = infoHtml.match(regex);
      return m ? m[1].replace(/<[^>]+>/g, "").trim() : "";
    };

    // 📋 Dữ liệu trả về
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
    return res.status(500).json({ error: `Lỗi xử lý: ${err.message}` });
  }
}
