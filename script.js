const btnInfo = document.getElementById("btnInfo");
const btnTopic = document.getElementById("btnTopic");
const output = document.getElementById("output");
const menuMain = document.getElementById("menuMain");

// ⏩ Mặc định: bấm “Tìm hiểu văn bản”
btnInfo.onclick = () => {
  const id = prompt("Nhập số hiệu văn bản (VD: 15/2023/NĐ-CP):");
  if (!id) return;
  showMenu(id);
};

// 🎯 Hiển thị menu chức năng
function showMenu(id) {
  menuMain.classList.add("d-none");
  output.classList.remove("d-none");
  output.innerHTML = `
    <div class="card shadow-sm p-3">
      <h5>Văn bản: <b>${id}</b></h5>
      <p>Chọn thao tác:</p>
      <ol>
        <li>Phân tích văn bản</li>
        <li>So sánh văn bản với văn bản khác</li>
        <li>Tóm tắt điểm mới</li>
        <li>Giải thích điều khoản</li>
        <li>0. Chuyển sang lựa chọn khác</li>
      </ol>
      <input id="choiceInput" class="form-control mb-2" placeholder="Nhập số lựa chọn..." />
      <button class="btn btn-primary" onclick="handleChoice('${id}')">Thực hiện</button>
      <button class="btn btn-secondary mt-2" onclick="resetMain()">↩ Quay lại menu</button>
    </div>
  `;
}

// 🧮 Xử lý lựa chọn người dùng
function handleChoice(id) {
  const choice = document.getElementById("choiceInput").value.trim();
  if (!choice) return alert("Vui lòng nhập số lựa chọn!");

  switch (choice) {
    case "1":
      analyzeLawDoc(id);
      break;
    case "0":
      resetMain();
      break;
    default:
      output.innerHTML = `
        <p>🧩 Chức năng này đang được phát triển...</p>
        <button class="btn btn-secondary mt-2" onclick="showMenu('${id}')">↩ Quay lại menu</button>
      `;
  }
}

// 📊 Phân tích văn bản (dữ liệu thật)
async function analyzeLawDoc(id) {
  output.innerHTML = `<p>⏳ Đang tra cứu văn bản <b>${id}</b>...</p>`;
  try {
    const res = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: id }),
    });
    const data = await res.json();

    if (data.error) {
      output.innerHTML = `
        <div class="alert alert-warning">
          ⚠️ ${data.error}
        </div>
        <button class="btn btn-secondary mt-2" onclick="showMenu('${id}')">↩ Quay lại menu</button>
      `;
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

// 🔄 Quay lại menu chính
function resetMain() {
  output.classList.add("d-none");
  menuMain.classList.remove("d-none");
}

window.handleChoice = handleChoice;
window.resetMain = resetMain;
window.showMenu = showMenu;
