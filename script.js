const btnInfo = document.getElementById("btnInfo");
const btnTopic = document.getElementById("btnTopic");
const output = document.getElementById("output");
const menuMain = document.getElementById("menuMain");

function showOutput(html) {
  output.innerHTML = html;
  output.classList.remove("d-none");
  menuMain.classList.add("d-none");
}

function resetMain() {
  output.classList.add("d-none");
  menuMain.classList.remove("d-none");
}

// ====================== MAIN FLOW ======================

// Khi bấm “Tìm hiểu văn bản”
btnInfo.onclick = () => {
  const id = prompt("Nhập số hiệu văn bản (VD: 15/2023/NĐ-CP):");
  if (!id) return;
  showMenu(id);
};

// Hiển thị menu lựa chọn
function showMenu(id) {
  showOutput(`
    <h5>Chọn hành động cho văn bản <b>${id}</b>:</h5>
    <ul>
      <li>1. Phân tích văn bản</li>
      <li>2. So sánh văn bản với văn bản khác</li>
      <li>3. Tóm tắt điểm mới</li>
      <li>4. Giải thích điều khoản</li>
      <li>0. Chuyển sang lựa chọn khác</li>
    </ul>
    <input id="choiceInput" type="text" class="form-control" placeholder="Nhập số lựa chọn..." />
    <button class="btn btn-primary mt-2" onclick="handleChoice('${id}')">Thực hiện</button>
  `);
}

// ====================== GỌI GPT API ======================
async function callGPT(mode, input) {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mode, input }),
  });
  return await res.json();
}

// ====================== XỬ LÝ LỰA CHỌN ======================
async function handleChoice(id) {
  const val = document.getElementById("choiceInput").value.trim();

  switch (val) {
    case "1": {
      showOutput("<p>⏳ Đang phân tích văn bản...</p>");
      const data = await callGPT("Phân tích văn bản", id);
      showOutput(`
        <h5>🔍 Phân tích văn bản ${id}</h5>
        <div>${data.reply}</div>
        <button class="btn btn-secondary mt-3" onclick="showMenu('${id}')">↩ Quay lại menu</button>
      `);
      break;
    }
    case "2": {
      const second = prompt("Nhập số hiệu văn bản thứ hai để so sánh:");
      if (!second) return showMenu(id);
      showOutput("<p>⏳ Đang so sánh văn bản...</p>");
      const data = await callGPT("So sánh văn bản", `${id} và ${second}`);
      showOutput(`
        <h5>📘 So sánh ${id} và ${second}</h5>
        <div>${data.reply}</div>
        <button class="btn btn-secondary mt-3" onclick="showMenu('${id}')">↩ Quay lại menu</button>
      `);
      break;
    }
    case "3": {
      showOutput("<p>⏳ Đang tóm tắt điểm mới...</p>");
      const data = await callGPT("Tóm tắt điểm mới", id);
      showOutput(`
        <h5>📝 Tóm tắt điểm mới của ${id}</h5>
        <div>${data.reply}</div>
        <button class="btn btn-secondary mt-3" onclick="showMenu('${id}')">↩ Quay lại menu</button>
      `);
      break;
    }
    case "4": {
      const term = prompt("Nhập điều khoản hoặc thuật ngữ cần giải thích:");
      if (!term) return showMenu(id);
      showOutput("<p>⏳ Đang giải thích điều khoản...</p>");
      const data = await callGPT("Giải thích điều khoản", `${term} trong ${id}`);
      showOutput(`
        <h5>📖 Giải thích điều khoản trong ${id}</h5>
        <div>${data.reply}</div>
        <button class="btn btn-secondary mt-3" onclick="showMenu('${id}')">↩ Quay lại menu</button>
      `);
      break;
    }
    case "0":
      resetMain();
      break;
    default:
      alert("Lựa chọn không hợp lệ! Nhập 0–4");
  }
}

// ====================== TÌM KIẾM THEO CHỦ ĐỀ ======================
btnTopic.onclick = async () => {
  const topic = prompt("Nhập chủ đề cần tìm (VD: an toàn lao động):");
  if (!topic) return;
  showOutput("<p>⏳ Đang tìm kiếm văn bản mới nhất...</p>");
  const data = await callGPT("Tìm kiếm theo chủ đề", topic);
  showOutput(`
    <h5>📘 Kết quả tìm kiếm cho chủ đề “${topic}”</h5>
    <div>${data.reply}</div>
    <button class="btn btn-primary mt-2" onclick="showMenu('${topic}')">Tiếp tục với văn bản này</button>
    <button class="btn btn-secondary mt-2" onclick="resetMain()">↩ Quay lại</button>
  `);
};

window.handleChoice = handleChoice;
window.showMenu = showMenu;
window.resetMain = resetMain;
