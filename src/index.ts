import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { PrismaClient } from "@prisma/client";
import { config } from "dotenv";
import { errorMiddleware } from "./errorMiddleware/error";
import userRouter from "./route/userRoute";
import gptRouter from "./route/gptRoute";

const app = express();
config();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

export const client = new PrismaClient();
client.$connect().then(() => console.log("Database Connected !"));

app.use("/api", userRouter);
app.use("/api", gptRouter);

app.use(errorMiddleware);
app.listen(process.env.PORT || 3000, () => console.log(`Express Connected !`));
