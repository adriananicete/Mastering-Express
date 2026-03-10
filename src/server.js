import express from "express";
import { loggerMiddleware } from "./middleware/usersMiddleware.js";
import router from "./routes/index.js";
import cookieParser from 'cookie-parser';
import session from "express-session";

const PORT = process.env.PORT || 8000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);
app.use(cookieParser('helloWorld'));
app.use(session({
  secret: 'ian the dev',
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 60000
  }
}))
app.use(router);

app.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  req.session.visited = true;
  res.send("Hello again Adrian");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
