// ============================
// TRỢ LÝ PHÂN TÍCH VĂN BẢN PHÁP LUẬT
// Bản hoàn chỉnh - 2025
// ============================

const btnInfo = document.getElementById("btn-info");
const menuMain = document.getElementById("menu-main");
const output = document.getElementById("output");

// Quay lại menu chính
function resetMain() {
  output.classList.add("d-none");
  menuMain.classList.remove("d-none");
  output.innerHTML = "";
}

// Xử lý khi người dùng chọn “Phân tích văn bản”
btnInfo.onclick = async () => {
  const code = prompt(
    "📘 Nhập số hiệu văn bản pháp luật (ví dụ: 15/2023/NĐ-CP, 12/2022/TT-BTC, 23/2021/QĐ-TTg):"
  );
  if (!code) return;

  menuMain.classList.add("d-none");
  output.classList.remove("d-none");
  output.innerHTML = `<div class="alert alert-info">⏳ Đang phân tích văn bản <b>${code}</b>...</div>`;

  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });

    const data = await res.json();

    // Nếu API trả lỗi
    if (!res.ok) {
      output.innerHTML = `
        <div class="alert alert-warning">
          ⚠️ ${data.error || "Không tìm thấy dữ liệu cho văn bản này."}
        </div>
        <button class="btn btn-secondary mt-3" onclick="resetMain()">↩️ Quay lại menu</button>
      `;
      return;
    }

    // Hiển thị kết quả
    output.innerHTML = `
      <div class="card p-3 shadow-sm">
        <h4 class="mb-3">📘 ${data.title || "Không rõ tiêu đề"}</h4>
        <ul style="list-style-type:none; padding-left:0;">
          <li><b>• Số hiệu:</b> ${data.code}</li>
          <li><b>• Loại văn bản:</b> ${data.type}</li>
          <li><b>• Cơ quan ban hành:</b> ${data.agency}</li>
          <li><b>• Ngày ban hành:</b> ${data.issued}</li>
          <li><b>• Ngày có hiệu lực:</b> ${data.effect}</li>
          <li><b>• Tình trạng hiệu lực:</b> ${data.status}</li>
        </ul>
        <hr>
        <p><a href="${data.link}" target="_blank" class="text-decoration-none">🔗 Xem toàn văn tại ${data.source}</a></p>
        <button class="btn btn-secondary mt-3" onclick="resetMain()">↩️ Quay lại menu</button>
      </div>
    `;
  } catch (err) {
    output.innerHTML = `
      <div class="alert alert-danger">
        ❌ Lỗi khi kết nối đến máy chủ:<br><b>${err.message}</b>
      </div>
      <button class="btn btn-secondary mt-3" onclick="resetMain()">↩️ Quay lại menu</button>
    `;
  }
};
