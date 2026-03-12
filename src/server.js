import express from "express";
import { loggerMiddleware } from "./middleware/usersMiddleware.js";
import router from "./routes/index.js";
import cookieParser from 'cookie-parser';
import session from "express-session";
import { users } from "./utils/data.js";
import passport from "passport";
import mongoose from "mongoose";
import './strategies/local-strategy.js';


const PORT = process.env.PORT || 8000;
const app = express();

mongoose.connect('mongodb://localhost/express_tutorial').then(() => console.log('Connected to Database')).catch(err => console.error('Unable to connect to database',err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);
app.use(cookieParser('helloWorld'));
app.use(session({
  secret: 'ian the dev',
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 60000 * 60
  }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(router);

app.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
  req.session.visited = true;
  res.send("Hello again Adrian");
});

app.post('/api/auth', passport.authenticate('local'), (req, res) => {
  res.status(200).json(req.user)

});

app.get('/api/auth/status', (req, res) => {
  console.log('Inside /auth/status endpoint')
  console.log(req.user);
  console.log(req.session)
  req.user ? res.status(200).json(req.user) : res.status(401).json({error: 'Unauthorized: User logout'})

});

app.post('/api/auth/logout', (req, res) => {
  if(!req.user) res.status(401).json({error: 'Unauthorized'})
  req.logOut((err) => {
    if(err) return res.sendStatus(400);
    res.status(200).json({ status: 'User Logout Successfully'})
  })
})

// app.post('/api/auth', (req, res) => {
//   const { email, password } = req.body;

//   const findUser = users.find(user => user.email === email);
//   if (!findUser || findUser.password !== password) return res.status(401).json({error: 'Error in Login: Bad Credentials!'});

//   req.session.user = findUser;
//   res.status(200).json({message: 'Login successfully',
//     data: {
//       findUser
//     }
//   })
// })

// app.get('/api/auth/status', (req, res) => {
//   req.sessionStore.get(req.sessionID, (err, session) => console.log(session));
//   return req.session.user ? res.status(200).json(req.session.user) : res.status(401).json({error: 'Not Authenticated'})
// });

// app.post('/api/cart', (req, res) => {
//   if (!req.session.user) return res.status(401).json({error: 'Unauthorized!'});
//   const item = req.body;
//   const { cart } = req.session;

//   if(cart) {
//     cart.push(item);
//   } else {
//     req.session.cart = [item];
//   }
//   res.status(200).json(item)
// });

// app.get('/api/cart', (req, res) => {
//   if(!req.session.user) return res.status(401).json({error: 'Unauthorized!'});
//   return res.status(200).json(req.session.cart ?? [])
// })

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
