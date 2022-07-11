const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join("./tmp"));
  },
  filename: function (req, file, cb) {
    cb(null, req.userId + path.extname(file.originalname));
  },
});

exports.upload = multer({ storage });
