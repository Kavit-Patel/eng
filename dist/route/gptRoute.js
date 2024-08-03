"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gptController_1 = require("../controller/gptController");
const gptRouter = express_1.default.Router();
gptRouter.post("/askForQuestion/:id", gptController_1.askForQuestion);
gptRouter.post("/askForAnswer/:id", gptController_1.askForAnsweres);
gptRouter.post("/saveTest/:id", gptController_1.saveTest);
exports.default = gptRouter;
