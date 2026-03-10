import express from "express";
import { loggerMiddleware } from "./middleware/usersMiddleware.js";
import router from "./routes/index.js";
import cookieParser from 'cookie-parser';

const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);
app.use(cookieParser('helloWorld'));
app.use(router);

app.get("/", (req, res) => {
  res.cookie("hello", "cookie", { maxAge: 30000, signed: true });
  res.send("Hello again Adrian");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
