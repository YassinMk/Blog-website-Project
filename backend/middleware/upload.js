const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'public','uploads'));
  },
  filename: function (req, file, cb) {
    const currentDate = new Date().toISOString().replace(/:/g, '-');
    const parts = file.originalname.split('.');
    const ext = parts[parts.length - 1];
    const filename = currentDate + '.' + ext;
    cb(null, filename);
  },
});

const uploadMiddleware = multer({ storage: storage });

module.exports = uploadMiddleware;