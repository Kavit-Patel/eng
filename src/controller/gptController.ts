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
      response: { text, data: data.text() },
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
    const text = data.text().split("\n");
    return res.status(200).json({
      success: true,
      message: "Success",
      response: { text, data: data.text() },
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
    const { question, ans }: { question: string; ans: string[] } = req.body;
    const { id } = req.params;
    if (!id) return next(new ErrorHandler(403, "Provide user info !"));
    if (!question || !ans)
      return next(new ErrorHandler(403, "Provide question !"));

    const newTset = await client.tsets.create({
      data: {
        sentance: question,
        answer: ans,
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
