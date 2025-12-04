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
// --- HIỂN THỊ MENU SAU KHI NHẬP SỐ HIỆU ---
function showMenu(id) {
  menuMain.classList.add("d-none");
  output.classList.remove("d-none");

  // Bước 1: Hiển thị menu lựa chọn
  output.innerHTML = `
    <div class="card shadow-sm p-3">
      <h5>📘 Văn bản: ${id}</h5>
      <p>Chọn thao tác mong muốn:</p>
      <ol>
        <li>Phân tích văn bản</li>
        <li>So sánh văn bản với văn bản khác</li>
        <li>Tóm tắt điểm mới</li>
        <li>Giải thích điều khoản</li>
        <li>0. Chuyển sang lựa chọn khác</li>
      </ol>
      <input id="choice" type="number" min="0" max="4" placeholder="Nhập số lựa chọn..." class="form-control mb-2">
      <button class="btn btn-primary" onclick="handleChoice('${id}')">Thực hiện</button>
      <button class="btn btn-secondary mt-2" onclick="resetMain()">↩ Quay lại menu</button>
    </div>
  `;
}

// --- XỬ LÝ LỰA CHỌN ---
async function handleChoice(id) {
  const choice = document.getElementById("choice").value.trim();
  if (choice === "") return alert("Vui lòng nhập số lựa chọn!");

  if (choice === "0") {
    resetMain();
    return;
  }

  if (choice === "1") {
    await analyzeLawDoc(id);
  } else if (choice === "2") {
    const other = prompt("Nhập số hiệu văn bản thứ hai để so sánh:");
    if (!other) return;
    showComparison(id, other);
  } else if (choice === "3") {
    showSummary(id);
  } else if (choice === "4") {
    const term = prompt("Nhập điều khoản hoặc thuật ngữ cần giải thích:");
    showExplain(id, term);
  } else {
    alert("Chỉ được chọn từ 0 đến 4!");
  }
}

// --- PHÂN TÍCH VĂN BẢN ---
async function analyzeLawDoc(id) {
  output.innerHTML = `<p>⏳ Đang tra cứu văn bản <b>${id}</b>...</p>`;
  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: id })
    });
    const data = await res.json();

    if (data.error) {
      output.innerHTML = `<p style="color:red">❌ ${data.error}</p>
        <button class="btn btn-secondary mt-2" onclick="showMenu('${id}')">↩ Quay lại menu</button>`;
      return;
    }

    output.innerHTML = `
      <div class="card shadow-sm p-3">
        <h5>📘 ${data.title}</h5>
        <ul>
          <li><b>Số hiệu:</b> ${data.code}</li>
          <li><b>Loại văn bản:</b> ${data.type}</li>
          <li><b>Cơ quan ban hành:</b> ${data.agency}</li>
          <li><b>Ngày ban hành:</b> ${data.signDate}</li>
          <li><b>Ngày có hiệu lực:</b> ${data.effectiveDate}</li>
          <li><b>Tình trạng hiệu lực:</b> ${data.status}</li>
        </ul>
        <p>🔗 <a href="${data.link}" target="_blank">Xem toàn văn tại VBPL.vn</a></p>
        <button class="btn btn-secondary mt-2" onclick="showMenu('${id}')">↩ Quay lại menu lựa chọn</button>
      </div>
    `;
  } catch (e) {
    output.innerHTML = `<p style="color:red">❌ Lỗi xử lý: ${e.message}</p>`;
  }
}


// --- CÁC HÀM GIẢ LẬP CHO 3,4 ---
function showComparison(a, b) {
  output.innerHTML = `
    <div class="card shadow-sm p-3">
      <h5>⚖️ So sánh ${a} và ${b}</h5>
      <ul>
        <li><b>Phạm vi áp dụng:</b> Cả hai đều điều chỉnh lĩnh vực tương tự.</li>
        <li><b>Hiệu lực:</b> ${a} hiệu lực 2023, ${b} hiệu lực 2024.</li>
        <li><b>Điểm khác biệt:</b> ${b} bổ sung quy định về quản lý điện tử.</li>
      </ul>
      <button class="btn btn-secondary mt-2" onclick="showMenu('${a}')">↩ Quay lại menu lựa chọn</button>
    </div>
  `;
}

function showSummary(id) {
  output.innerHTML = `
    <div class="card shadow-sm p-3">
      <h5>📝 Tóm tắt điểm mới của ${id}</h5>
      <ul>
        <li>Tăng cường trách nhiệm quản lý nhà nước.</li>
        <li>Bổ sung quy định xử phạt mới.</li>
        <li>Đơn giản hóa thủ tục hành chính.</li>
        <li>Ứng dụng công nghệ thông tin trong thực thi.</li>
        <li>Tăng tính minh bạch và giám sát.</li>
      </ul>
      <p><b>TL;DR:</b> ${id} chủ yếu cải tiến quy trình quản lý, giảm thủ tục, tăng giám sát.</p>
      <button class="btn btn-secondary mt-2" onclick="showMenu('${id}')">↩ Quay lại menu lựa chọn</button>
    </div>
  `;
}

function showExplain(id, term) {
  output.innerHTML = `
    <div class="card shadow-sm p-3">
      <h5>💬 Giải thích điều khoản / thuật ngữ trong ${id}</h5>
      <p><b>${term}:</b> Là quy định được nêu trong văn bản nhằm hướng dẫn cụ thể việc áp dụng pháp luật trong thực tiễn.</p>
      <button class="btn btn-secondary mt-2" onclick="showMenu('${id}')">↩ Quay lại menu lựa chọn</button>
    </div>
  `;
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


