import path, { resolve } from "path";
import { unlinkSync } from "fs";

const __dirname = resolve();

// remove photo on store
export const removePhoto = (urlPath) => {
  unlinkSync(path.join(__dirname, `public/user/${urlPath}`));
};

// remove photo on store
export const removeGalleryPhoto = (urlPath) => {
  unlinkSync(path.join(__dirname, `public/gallery/${urlPath}`));
};
