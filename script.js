const output = document.getElementById("output");
const btnInfo = document.getElementById("btnInfo");
const btnTopic = document.getElementById("btnTopic");

function showOutput(html) {
  output.innerHTML = html;
  output.classList.remove("d-none");
}

function showMenu(docNumber) {
  showOutput(`
    <h5>Văn bản: <span class="text-primary">${docNumber}</span></h5>
    <p>Chọn thao tác:</p>
    <ol>
      <li>Phân tích văn bản</li>
      <li>So sánh văn bản với văn bản khác</li>
      <li>Tóm tắt điểm mới</li>
      <li>Giải thích điều khoản</li>
      <li value="0">Chuyển sang lựa chọn khác</li>
    </ol>
    <input id="choice" class="form-control mb-2" placeholder="Nhập số lựa chọn (0–4)">
    <button class="btn btn-primary" onclick="handleChoice('${docNumber}')">Thực hiện</button>
  `);
}

function handleChoice(docNumber) {
  const choice = document.getElementById("choice").value.trim();
  if (choice === "0") return resetMain();

  switch (choice) {
    case "1":
      showOutput(`<h5>🔍 Phân tích văn bản ${docNumber}</h5>
        <ul>
          <li><b>Nội dung chính:</b> (ví dụ – đây là phần phân tích tự động sau này)</li>
          <li><b>Phạm vi áp dụng:</b> ...</li>
          <li><b>Hiệu lực:</b> ...</li>
          <li><b>Căn cứ pháp lý:</b> ...</li>
        </ul>
        <button class="btn btn-secondary" onclick="showMenu('${docNumber}')">↩ Quay lại menu</button>`);
      break;

    case "2":
      const doc2 = prompt("Nhập số hiệu văn bản thứ hai để so sánh:");
      if (!doc2) return alert("Chưa nhập văn bản thứ hai.");
      showOutput(`<h5>⚖️ So sánh ${docNumber} và ${doc2}</h5>
        <ul>
          <li><b>Phạm vi áp dụng:</b> ...</li>
          <li><b>Hiệu lực:</b> ...</li>
          <li><b>Nghĩa vụ:</b> ...</li>
          <li><b>Chế tài:</b> ...</li>
          <li><b>Điểm mới:</b> ...</li>
        </ul>
        <button class="btn btn-secondary" onclick="showMenu('${docNumber}')">↩ Quay lại menu</button>`);
      break;

    case "3":
      showOutput(`<h5>📝 Tóm tắt điểm mới của ${docNumber}</h5>
        <ul>
          <li>Điểm mới 1...</li>
          <li>Điểm mới 2...</li>
          <li>Điểm mới 3...</li>
          <li>Điểm mới 4...</li>
        </ul>
        <p><b>TL;DR:</b> Các thay đổi chính tập trung vào ...</p>
        <button class="btn btn-secondary" onclick="showMenu('${docNumber}')">↩ Quay lại menu</button>`);
      break;

    case "4":
      const clause = prompt("Nhập điều khoản hoặc thuật ngữ cần giải thích:");
      if (!clause) return alert("Bạn chưa nhập điều khoản hoặc thuật ngữ.");
      showOutput(`<h5>📘 Giải thích: ${clause}</h5>
        <p><b>Giải thích:</b> Đây là phần mô tả dễ hiểu, có ví dụ minh họa sau này.</p>
        <button class="btn btn-secondary" onclick="showMenu('${docNumber}')">↩ Quay lại menu</button>`);
      break;

    default:
      alert("Vui lòng nhập số từ 0–4");
  }
}

function resetMain() {
  output.classList.add("d-none");
  output.innerHTML = "";
}

btnInfo.onclick = () => {
  const doc = prompt("Nhập số hiệu văn bản (VD: 15/2023/NĐ-CP):");
  if (doc) showMenu(doc);
};

btnTopic.onclick = () => {
  const topic = prompt("Nhập chủ đề cần tìm (VD: an toàn lao động):");
  if (!topic) return;
  showOutput(`<h5>🔎 Kết quả tìm kiếm cho chủ đề "${topic}"</h5>
    <p><b>Văn bản mới nhất:</b> (ví dụ) 15/2023/NĐ-CP – Ban hành ngày 15/8/2023</p>
    <p><b>Cơ quan ban hành:</b> Chính phủ</p>
    <button class="btn btn-primary" onclick="showMenu('15/2023/NĐ-CP')">Tiếp tục với văn bản này</button>
    <button class="btn btn-secondary mt-2" onclick="resetMain()">↩ Quay lại</button>`);
};
