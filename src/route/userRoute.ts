import express from "express";
import { cookieAutoLogin, login, register } from "../controller/userController";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/cookieAutoLogin/:userId", cookieAutoLogin);

export default userRouter;
