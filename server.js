const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const app = express();
const port = 3000;

// Tạo thư mục uploads nếu chưa có
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Cấu hình multer để lưu file
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Middleware cho phép truy cập file tĩnh (ảnh)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Trang upload HTML đơn giản
app.get("/", (req, res) => {
  res.send(`
    <h2>Tải ảnh lên</h2>
    <form action="/upload" method="post" enctype="multipart/form-data">
      <input type="file" name="image" />
      <button type="submit">Upload</button>
    </form>
  `);
});

// Xử lý ảnh tải lên
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.send("Không có ảnh nào được gửi.");
  res.send(`Đã lưu ảnh! <br><a href="/uploads/${req.file.filename}" target="_blank">Xem ảnh</a>`);
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});