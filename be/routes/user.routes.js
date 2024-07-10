import { Router } from "express";
import {
  signup,
  signin,
  getUserById,
  editUserById
} from "../controllers/user.controllers.js";
import { verifyAccessToken } from "../middlewares/auth.middleware.js";
import multer from "multer";
import { alignStorage } from "../config/storage.js";

const userRouter = Router();
const userImage = multer({ storage: alignStorage });

userRouter.post("/register", signup);
userRouter.post("/login", signin);
userRouter.get("/", verifyAccessToken, getUserById);
userRouter.put(
  "/",
  userImage.single("user-image"),
  verifyAccessToken,
  editUserById
);

export default userRouter;
