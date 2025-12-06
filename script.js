// script.js
// ------------------------------------
// Trợ lý phân tích văn bản pháp luật
// Giao diện tương tác chính trên trình duyệt
// ------------------------------------

// Các phần tử chính trong HTML
const btnInfo = document.getElementById("btn-info");
const btnTopic = document.getElementById("btn-topic");
const menuMain = document.getElementById("menu-main");
const output = document.getElementById("output");

// ✅ Hàm hiển thị nội dung ra màn hình
function showOutput(html) {
  output.innerHTML = html;
  menuMain.classList.add("d-none");
  output.classList.remove("d-none");
}

// ✅ Hàm quay lại menu chính
function resetMain() {
  output.classList.add("d-none");
  menuMain.classList.remove("d-none");
}

// ✅ Gọi API GPT để phân tích văn bản
async function analyzeLaw(code) {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Lỗi không xác định.");
  return data.analysis;
}

// ✅ Khi nhấn “Tìm hiểu văn bản”
btnInfo.onclick = async () => {
  const code = prompt(
    "Nhập số hiệu văn bản (ví dụ: 15/2023/NĐ-CP, 22/2022/TT-BTC, 23/2021/QĐ-TTg):"
  );
  if (!code) return;

  // Hiển thị trạng thái đang xử lý
  showOutput(`<p>⏳ Đang phân tích văn bản <b>${code}</b>...</p>`);

  try {
    const result = await analyzeLaw(code);
    showOutput(`
      <h5>📘 Kết quả phân tích cho: <b>${code}</b></h5>
      <div class="alert alert-info text-start" style="white-space: pre-wrap;">
        ${result}
      </div>
      <button class="btn btn-secondary mt-3" onclick="resetMain()">↩️ Quay lại menu</button>
    `);
  } catch (err) {
    showOutput(`
      <div class="alert alert-danger">
        ❌ Không thể phân tích văn bản. <br>
        <b>Lỗi:</b> ${err.message}
      </div>
      <button class="btn btn-secondary mt-3" onclick="resetMain()">↩️ Quay lại menu</button>
    `);
  }
};

// ✅ Khi nhấn “Tìm kiếm theo chủ đề”
btnTopic.onclick = async () => {
  const topic = prompt(
    "Nhập chủ đề cần tìm (ví dụ: lao động, thuế, xây dựng, đất đai...):"
  );
  if (!topic) return;

  showOutput(`<p>🔍 Đang tìm kiếm văn bản về chủ đề: <b>${topic}</b>...</p>`);

  // Giả lập chức năng tìm kiếm (bạn có thể mở rộng sau này)
  setTimeout(() => {
    showOutput(`
      <h5>📂 Kết quả tìm kiếm chủ đề: <b>${topic}</b></h5>
      <p>(Tính năng tra cứu văn bản thật sẽ được cập nhật trong bản sau)</p>
      <button class="btn btn-secondary mt-3" onclick="resetMain()">↩️ Quay lại menu</button>
    `);
  }, 1500);
};
