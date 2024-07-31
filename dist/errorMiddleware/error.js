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
exports.errorMiddleware = exports.ErrorHandler = void 0;
class ErrorHandler extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
        this.status = status;
    }
}
exports.ErrorHandler = ErrorHandler;
const errorMiddleware = (err, req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const status = (_a = err.status) !== null && _a !== void 0 ? _a : 500;
    const message = (_b = err.message) !== null && _b !== void 0 ? _b : "Internal Error !";
    return res.status(status).json({ success: false, message });
});
exports.errorMiddleware = errorMiddleware;
