const express = require('express');
const multer = require('multer');
const cors = require('cors');
const app = express();
const path = require('path');

app.use(cors());
app.use(express.static(path.join(__dirname))); // Load index.html

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send("Không có file được tải lên.");
  const filePath = `http://localhost:3000/uploads/${req.file.filename}`;
  res.send(`
    <h3>✅ Tải ảnh thành công!</h3>
    <img src="${filePath}" width="200"><br>
    <p>Link ảnh: <a href="${filePath}" target="_blank">${filePath}</a></p>
  `);
});

app.use('/uploads', express.static('uploads'));

app.listen(3000, () => console.log('🚀 Server chạy tại http://localhost:3000'));
