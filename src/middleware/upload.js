const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = "src/uploads";

    switch (file.mimeType) {
      case "video/mp4":
        folder += "/videos";
        break;

      case "image/jpeg":
      case "image/png":
      case "image/webp":
      case "image/gif":
        folder += "/images";
        break;

      case "audio/mpeg":
      case "audio/mp3":
      case "audio/wav":
      case "audio/ogg":
        folder += "/audios";
        break;

      default:
        folder += "/others";
        break;
    }

    cb(null, folder);
  },

  filename: (req, file, cb) => {
    cb(null, `STORE-PILOT-${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });
module.exports = upload;
