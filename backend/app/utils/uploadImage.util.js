const multer = require('multer');
const path = require('path');

const storage = multer.memoryStorage(); 

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase(); 

    if (!['.png', '.jpg', '.jpeg'].includes(ext)) {
      return cb(new Error('Chỉ cho phép đưa lên file.png file.jpg và file.jpeg!'), false);
    }

    cb(null, true); 
  },
});

module.exports = { upload };
