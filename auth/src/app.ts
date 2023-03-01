import { NotFoundError } from "@tm-cakitomakito/common";
import { errorHandler } from "@tm-cakitomakito/common";
import express from "express";
import "express-async-errors";
import cookieSession from "cookie-session";

import { json } from "body-parser";
import { healthRouter } from "./routes/health";
import { signupRouter } from "./routes/signup";
import { signinRouter } from "./routes/signin";
import { currentUserRouter } from "./routes/current-user";
import { signoutRouter } from "./routes/signout";
const app = express();
app.set("trust proxy", true);

app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: true,
  })
);
app.use("/health", healthRouter);
app.use("/signup", signupRouter);
app.use("/signin", signinRouter);
app.use("/signout", signoutRouter);
app.use("/currentuser", currentUserRouter);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);
export { app };
