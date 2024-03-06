const multer = require("multer"); //multer 패키지 참조
const path = require("path");

const profileStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/profiles/");
  },
  filename: function (req, file, callback) {
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    callback(null, basename + "-" + Date.now() + extension);
  },
});

const postStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/posts/");
  },
  filename: function (req, file, callback) {
    const extension = path.extname(file.originalname);
    const basename = path.basename(file.originalname, extension);
    callback(null, basename + "-" + Date.now() + extension);
  },
});

const uploadProfile = multer({ storage: profileStorage });
const uploadPost = multer({ storage: postStorage });

module.exports = { uploadProfile, uploadPost };
