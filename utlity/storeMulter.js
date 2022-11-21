import multer from "multer";
import path, { resolve } from "path";

const __dirname = resolve();

// profile  image Update
export const profileUpdate = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "public/user/"));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "_" + file.originalname);
    },
  });
  return multer({ storage }).single("photo");
};

// gallery image update
export const userGallery = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, "public/gallery/"));
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "_" + file.originalname);
    },
  });
  return multer({ storage }).array("gallery");
};
