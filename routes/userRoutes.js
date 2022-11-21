//file include
import express from "express";
import {
  dashboard,
  userLogin,
  userRegister,
  getUserRegister,
  getUserLogin,
  UserLogout,
  userAccountActivision,
  resentMail,
  forgetPassword,
  forgetPasswordPage,
  forgetPasswordChangePage,
  forgetPasswordChange,
  passwordChange,
  passwordChangePage,
  profileEditPage,
  profileEdit,
  profilePhoto,
  profilePhotoPage,
  galleryPage,
  gallery,
  friendsPage,
  friends,
  deleteGalleryImage,
  addFriends,
  unFriends,
  friendProfile,
  following,
  follower
} from "../controllers/userControllers.js";
import verifyAuthMiddleWares from "../middlewares/varifyAuthMiddlewares.js";
import authMiddlewares from "../middlewares/authMiddlewares.js";
import { profileUpdate, userGallery } from "../utlity/storeMulter.js";

//route init
const userRouter = express.Router();

//user route
userRouter.get("/", verifyAuthMiddleWares, dashboard);

userRouter.get("/register", authMiddlewares, userRegister);
userRouter.post("/register", getUserRegister);
userRouter.get("/login", authMiddlewares, userLogin);
userRouter.post("/login", getUserLogin);

userRouter.get("/logout", UserLogout);

userRouter.get("/resentMail/:email", authMiddlewares, resentMail);
userRouter.get("/active/:token", userAccountActivision);

//forget password
userRouter.get("/forgetPassword", authMiddlewares, forgetPasswordPage);
userRouter.post("/forgetPassword", forgetPassword);
userRouter.get(
  "/forgetPassword/:token",
  authMiddlewares,
  forgetPasswordChangePage
);
userRouter.post("/forgetPassword/:token", forgetPasswordChange);

// change password
userRouter.get("/changePassword", verifyAuthMiddleWares, passwordChangePage);
userRouter.post("/changePassword", passwordChange);

//profile edit
userRouter.get("/profileEdit", verifyAuthMiddleWares, profileEditPage);
userRouter.post("/profileEdit", profileEdit);

//profile photo profilePhoto
userRouter.get("/profilePhoto", verifyAuthMiddleWares, profilePhotoPage);
userRouter.post("/profilePhoto", profileUpdate(), profilePhoto);

// Gallery
userRouter.get("/gallery", verifyAuthMiddleWares, galleryPage);
userRouter.post("/gallery", userGallery(), gallery);
userRouter.get(
  "/deleteGalleryImage/:deleteItem",
  verifyAuthMiddleWares,
  deleteGalleryImage
);

// friends
userRouter.get("/friends", verifyAuthMiddleWares, friendsPage);
userRouter.post("/friends", friends);
userRouter.get("/friends/:id", verifyAuthMiddleWares, addFriends);
userRouter.get("/unfriends/:id", verifyAuthMiddleWares, unFriends);
userRouter.get("/friendProfile/:id", verifyAuthMiddleWares, friendProfile);

//following and follower
userRouter.get("/following/:id", verifyAuthMiddleWares, following);
userRouter.get("/follower/:id", verifyAuthMiddleWares, follower);

//export default
export default userRouter;
