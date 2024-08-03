"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserTsets = exports.saveTest = exports.askForAnsweres = exports.askForQuestion = void 0;
const error_1 = require("../errorMiddleware/error");
const generative_ai_1 = require("@google/generative-ai");
const __1 = require("..");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API || " ");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const askForQuestion = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { question } = req.body;
        const { id } = req.params;
        if (!id)
            return next(new error_1.ErrorHandler(403, "Provide user info !"));
        if (!question)
            return next(new error_1.ErrorHandler(403, "Provide question !"));
        const request = yield model.generateContent(question);
        const data = yield request.response;
        const text = data.text().split("\n")[0];
        return res.status(200).json({
            success: true,
            message: "Success",
            response: text,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Internal Server Error while asking gpt ?",
        });
    }
});
exports.askForQuestion = askForQuestion;
const askForAnsweres = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { question } = req.body;
        const { id } = req.params;
        if (!id)
            return next(new error_1.ErrorHandler(403, "Provide user info !"));
        if (!question)
            return next(new error_1.ErrorHandler(403, "Provide question !"));
        const request = yield model.generateContent(question);
        const data = yield request.response;
        const text = data
            .text()
            .split("\n")
            .filter((el) => el.length > 0);
        return res.status(200).json({
            success: true,
            message: "Success",
            response: text,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Internal Server Error while asking gpt ?",
        });
    }
});
exports.askForAnsweres = askForAnsweres;
const saveTest = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { question, ans, audio, } = req.body;
        const { id } = req.params;
        console.log(ans, audio);
        if (!id)
            return next(new error_1.ErrorHandler(403, "Provide user info !"));
        if (!question || !ans || !audio)
            return next(new error_1.ErrorHandler(403, "Provide all details including sentance , answerea and audio file !"));
        const audioBuffer = Buffer.from(audio, "base64");
        const newTset = yield __1.client.tsets.create({
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Internal Server Error while saving tset ?",
        });
    }
});
exports.saveTest = saveTest;
const getUserTsets = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id)
            return next(new error_1.ErrorHandler(403, "Provide userId !"));
        const tsets = yield __1.client.tsets.findMany({
            where: { userId: parseInt(id) },
        });
        if (!tsets)
            return next(new error_1.ErrorHandler(404, " No tests exists for current user !"));
        return res.status(200).json({
            success: true,
            message: tsets.length === 0
                ? "You haven't attempted/saved any tests !"
                : "Tsets fetched successfully !",
            response: tsets,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error while getting user tsets !",
        });
    }
});
exports.getUserTsets = getUserTsets;
