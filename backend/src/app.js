import express from "express";
import cors from "cors";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import router from "./app/routes/index.js";
import globalErrorHandler from "./app/middlewares/globalErrorHandler.js";

// application
const app = express();
const port = process.env.PORT;

// parsers
app.use(cors());
app.use(bodyParser.json({ limit: "10mb" }));
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON format" });
  }
  next();
});


app.use(cookieParser());

app.use("/api/v1", router);

app.get("/", (req, res) =>
  res.json({ status: "200", message: "server is running" })
);

app.use(globalErrorHandler);

export default app;