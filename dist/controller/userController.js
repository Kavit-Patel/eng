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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cookieAutoLogin = exports.login = exports.register = void 0;
const error_1 = require("../errorMiddleware/error");
const __1 = require("..");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password)
            return next(new error_1.ErrorHandler(403, "Provide all details !"));
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield __1.client.users.create({
            data: { name, email, password: hashedPassword },
        });
        const token = jsonwebtoken_1.default.sign({ userId: newUser.id }, process.env.JWT_SECRET || " ");
        return res
            .cookie("eng_token", token, {
            secure: false,
            maxAge: 10000000,
            sameSite: "none",
        })
            .status(201)
            .json({ success: true, message: "User Created !", response: newUser });
    }
    catch (error) {
        return res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error ",
        });
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return next(new error_1.ErrorHandler(403, "Provide all details !"));
        const user = yield __1.client.users.findUnique({
            where: { email },
            include: { tset: true, audio: true },
        });
        if (!user) {
            return next(new error_1.ErrorHandler(403, "Email is invalid !"));
        }
        const matchPassword = yield bcrypt_1.default.compare(password, user.password);
        if (!matchPassword) {
            return next(new error_1.ErrorHandler(403, "Password is invalid !"));
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET || " ");
        return res
            .cookie("eng_token", token, {
            secure: false,
            maxAge: 10000000,
            sameSite: "none",
        })
            .status(200)
            .json({ success: true, message: "User Logged In !", response: user });
    }
    catch (error) {
        return res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error ",
        });
    }
});
exports.login = login;
const cookieAutoLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId)
            return next(new error_1.ErrorHandler(403, "userId is invalid !"));
        const token = req.cookies["eng_token"];
        if (!token)
            return next(new error_1.ErrorHandler(403, "Cookie is not present !"));
        const data = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || " ");
        if (!data || typeof data !== "object" || data.userId !== parseInt(userId)) {
            return next(new error_1.ErrorHandler(403, "Cookie doesn't matched"));
        }
        const user = yield __1.client.users.findUnique({
            where: { id: parseInt(data.userId) },
            include: { tset: true, audio: true },
        });
        if (!user)
            return next(new error_1.ErrorHandler(403, "User doesn't exists !"));
        return res.status(200).json({
            success: true,
            message: "User auto logged in !",
            response: user,
        });
    }
    catch (error) {
        return res.status(404).json({
            success: false,
            message: error instanceof Error ? error.message : "Internal Server Error ",
        });
    }
});
exports.cookieAutoLogin = cookieAutoLogin;
