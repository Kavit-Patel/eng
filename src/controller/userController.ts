import { NextFunction, Request, response, Response } from "express";
import { ErrorHandler } from "../errorMiddleware/error";
import { client } from "..";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return next(new ErrorHandler(403, "Provide all details !"));
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await client.users.create({
      data: { name, email, password: hashedPassword },
    });
    const token = jwt.sign(
      { userId: newUser.id },
      process.env.JWT_SECRET || " "
    );
    return res
      .cookie("eng_token", token, {
        secure: false,
        maxAge: 10000000,
        sameSite: "none",
      })
      .status(201)
      .json({ success: true, message: "User Created !", response: newUser });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Internal Server Error ",
    });
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return next(new ErrorHandler(403, "Provide all details !"));
    const user = await client.users.findUnique({
      where: { email },
      include: { tset: true },
    });
    if (!user) {
      return next(new ErrorHandler(403, "Email is invalid !"));
    }
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return next(new ErrorHandler(403, "Password is invalid !"));
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || " ");
    const tenDays = 10 * 24 * 60 * 60 * 1000;
    res.cookie("eng_token", token, {
      secure: false,
      httpOnly: true,
      expires: new Date(Date.now() + tenDays),
      sameSite: "none",
    });
    return res
      .status(200)
      .json({ success: true, message: "User Logged In !", response: user });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Internal Server Error ",
    });
  }
};
export const cookieAutoLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId } = req.params;
    if (!userId) return next(new ErrorHandler(403, "userId is invalid !"));
    const token = req.cookies["eng_token"];
    if (!token) return next(new ErrorHandler(403, "Cookie is not present !"));
    const data = jwt.verify(token, process.env.JWT_SECRET || " ");
    if (!data || typeof data !== "object" || data.userId !== parseInt(userId)) {
      return next(new ErrorHandler(403, "Cookie doesn't matched"));
    }
    const user = await client.users.findUnique({
      where: { id: parseInt(data.userId) },
      include: { tset: true },
    });
    if (!user) return next(new ErrorHandler(403, "User doesn't exists !"));
    return res.status(200).json({
      success: true,
      message: "User auto logged in !",

      response: user,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Internal Server Error ",
    });
  }
};
