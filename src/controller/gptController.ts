import { NextFunction, Request, response, Response } from "express";
import { ErrorHandler } from "../errorMiddleware/error";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { client } from "..";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API || " ");

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const askForQuestion = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { question } = req.body;
    const { id } = req.params;
    if (!id) return next(new ErrorHandler(403, "Provide user info !"));
    if (!question) return next(new ErrorHandler(403, "Provide question !"));
    const request = await model.generateContent(question);
    const data = await request.response;
    const text = data.text().split("\n")[0];
    return res.status(200).json({
      success: true,
      message: "Success",
      response: text,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Internal Server Error while asking gpt ?",
    });
  }
};

export const askForAnsweres = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { question } = req.body;
    const { id } = req.params;
    if (!id) return next(new ErrorHandler(403, "Provide user info !"));
    if (!question) return next(new ErrorHandler(403, "Provide question !"));
    const request = await model.generateContent(question);
    const data = await request.response;
    const text = data
      .text()
      .split("\n")
      .filter((el) => el.length > 0);
    return res.status(200).json({
      success: true,
      message: "Success",
      response: text,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Internal Server Error while asking gpt ?",
    });
  }
};

export const saveTest = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {
      question,
      ans,
      audio,
    }: { question: string; ans: string[]; audio: string } = req.body;
    const { id } = req.params;
    if (!id) return next(new ErrorHandler(403, "Provide user info !"));
    if (!question || !ans || !audio)
      return next(
        new ErrorHandler(
          403,
          "Provide all details including sentance , answerea and audio file !"
        )
      );
    const audioBuffer = Buffer.from(audio, "base64");
    const newTset = await client.tsets.create({
      data: {
        sentance: question,
        answer: ans,
        audio: audioBuffer,
        userId: parseInt(id),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Test Saved Successfully !",
      response: newTset,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Internal Server Error while saving tset ?",
    });
  }
};
export const getUserTsets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) return next(new ErrorHandler(403, "Provide userId !"));
    const tsets = await client.tsets.findMany({
      where: { userId: parseInt(id) },
    });
    if (!tsets)
      return next(new ErrorHandler(404, " No tests exists for current user !"));
    return res.status(200).json({
      success: true,
      message:
        tsets.length === 0
          ? "You haven't attempted/saved any tests !"
          : "Tsets fetched successfully !",
      response: tsets,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal Server Error while getting user tsets !",
    });
  }
};
