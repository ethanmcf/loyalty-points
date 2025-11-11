const uploadDir = "uploads/avatars";
const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Create upload directory if it doens't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// Set up storage
// reference: ai.txt (4)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const username = req.user.utorid;
    const ext = path.extname(file.originalname);
    cb(null, `${username}${ext}`);
  },
});

// Create the upload instance
const upload = multer({ storage });

module.exports = upload;
