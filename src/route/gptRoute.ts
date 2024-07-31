import express from "express";
import { askForAnsweres, askForQuestion } from "../controller/gptController";

const gptRouter = express.Router();

gptRouter.post("/askForQuestion/:id", askForQuestion);
gptRouter.post("/askForAnswer/:id", askForAnsweres);

export default gptRouter;
