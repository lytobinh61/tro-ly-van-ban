// --- BẮT SỰ KIỆN NÚT MENU CHÍNH ---
const btnInfo = document.getElementById("btnInfo");
const btnTopic = document.getElementById("btnTopic");
const menuMain = document.getElementById("menuMain");
const output = document.getElementById("output");

// 🔹 Nút “Tìm hiểu văn bản”
btnInfo.onclick = () => {
  const id = prompt("Nhập số hiệu văn bản (VD: 15/2023/NĐ-CP):");
  if (!id) return;
  showMenu(id);
};

// 🔹 Nút “Tìm kiếm theo chủ đề”
btnTopic.onclick = () => {
  const topic = prompt("Nhập chủ đề cần tìm (VD: an toàn lao động):");
  if (!topic) return;
  showTopic(topic);
};

// --- HÀM PHÂN TÍCH VĂN BẢN ---
async function showMenu(id) {
  menuMain.classList.add("d-none");
  output.classList.remove("d-none");
  output.innerHTML = `<p>⏳ Đang phân tích văn bản...</p>`;

  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: id })
    });

    if (!res.ok) throw new Error(`API lỗi: ${res.status}`);

    const data = await res.json();

    output.innerHTML = `
      <div class="card shadow-sm p-3">
        <h5>🔍 Phân tích văn bản ${data.code}</h5>
        <ul>
          <li><b>Nội dung chính:</b> ${data.summary}</li>
          <li><b>Phạm vi áp dụng:</b> ${data.scope}</li>
          <li><b>Hiệu lực:</b> ${data.effect}</li>
          <li><b>Căn cứ pháp lý:</b> ${data.basis}</li>
        </ul>
        <button class="btn btn-secondary mt-3" onclick="resetMain()">↩ Quay lại menu</button>
      </div>
    `;
  } catch (err) {
    output.innerHTML = `<p style="color:red">❌ Lỗi: ${err.message}</p>
    <button class="btn btn-secondary mt-2" onclick="resetMain()">↩ Quay lại menu</button>`;
  }
}

// --- HÀM TÌM KIẾM THEO CHỦ ĐỀ ---
function showTopic(topic) {
  menuMain.classList.add("d-none");
  output.classList.remove("d-none");
  output.innerHTML = `
    <h5>📚 Kết quả tìm kiếm cho chủ đề "${topic}"</h5>
    <p>Văn bản mới nhất: <b>15/2023/NĐ-CP</b><br>
    Ban hành ngày 15/8/2023<br>
    Cơ quan ban hành: <b>Chính phủ</b></p>
    <button class="btn btn-primary" onclick="showMenu('15/2023/NĐ-CP')">Phân tích văn bản này</button>
    <button class="btn btn-secondary mt-2" onclick="resetMain()">↩ Quay lại menu</button>
  `;
}

// --- HÀM QUAY LẠI MENU CHÍNH ---
function resetMain() {
  output.classList.add("d-none");
  menuMain.classList.remove("d-none");
}
