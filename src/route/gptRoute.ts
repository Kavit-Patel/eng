import express from "express";
import {
  askForAnsweres,
  askForQuestion,
  saveTest,
} from "../controller/gptController";

const gptRouter = express.Router();

gptRouter.post("/askForQuestion/:id", askForQuestion);
gptRouter.post("/askForAnswer/:id", askForAnsweres);
gptRouter.post("/saveTest/:id", saveTest);

export default gptRouter;
