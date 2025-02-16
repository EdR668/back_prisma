import express, { NextFunction, Request, Response } from "express";
import router from "./routes/index";
import cors from "cors";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
import "dotenv/config";
import swaggerUI from "swagger-ui-express";
import specs from "../swagger/swagger";
import fileUpload from "express-fileupload";
import path from "path";

const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

app.use(fileUpload({ useTempFiles: false }));

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});
app.use("/api", router);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));
app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = " An Unknown error ocurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});
export default app;
