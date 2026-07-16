import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

const app = express();

app.use(helmet());

app.use(cors());

app.use(compression());

app.use(express.json());

app.use(cookieParser());

app.use(morgan("dev"));

export default app;