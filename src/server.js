import express from "express";
import { body, matchedData, validationResult } from "express-validator";
import {
  loggerMiddleware,
  loggerPostMiddleware,
  resolveIndexByUserId,
} from "./middleware/usersMiddleware.js";

const PORT = process.env.PORT || 8000;
const app = express();

const users = [
  { id: 1, name: "Adrian", email: "anicete.ian14@gmail.com" },
  { id: 2, name: "Roselyn", email: "roselyn@gmail.com" },
  { id: 3, name: "Shaira", email: "neslie@gmail.com" },
  { id: 4, name: "Angelo", email: "angelo@gmail.com" },
  { id: 5, name: "Aaron", email: "aaron@gmail.com" },
  { id: 6, name: "Albert", email: "albert@gmail.com" },
  { id: 7, name: "Antonia", email: "antonia@gmail.com" },
];

const products = [
  { id: 123, name: "Guitar", price: 100 },
  { id: 456, name: "Drums", price: 250 },
  { id: 789, name: "Keyboard", price: 150 },
];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);

app.get("/", (req, res) => {
  res.send("Hello again Adrian");
});

// @desc Get all users
// @route GET /api/users
app.get("/api/users", (req, res) => {
  console.log(req.query);

  const {
    query: { filter, value },
  } = req;

  if (filter && value) {
    const filteredUser = users.filter((user) =>
      user[filter].toLowerCase().includes(value.toLowerCase()),
    );
    return res.json(filteredUser);
  } else {
    return res.json(users);
  }
});

// @desc Get single user
// @route GET /api/users/:id
app.get("/api/users/:id", (req, res) => {
  const id = Number(req.params.id);

  // Check if the id is NaN
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid Id" });
  }

  const user = users.find((user) => user.id === id);

  // if the user doesn't exists
  if (!user) {
    return res.status(404).json({ error: "User not found!" });
  }
  res.status(200).json(user);
});

// @desc Create new user
// @route POST /api/users
app.post(
  "/api/users",
  [body("name")
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ min: 2 })
    .withMessage("Characters length must be atleast 2")
    .isString()
    .withMessage("Name must a string"),
    body('email').notEmpty().withMessage('You must have an email')
  ],
  (req, res) => {
    const result = validationResult(req);
    console.log(result);

    if(!result.isEmpty()) return res.status(400).json({ error: result.array().map(err => err.msg)});

    const body = matchedData(req);
    console.log(body);
    const { name, email } = body;

    if (!name?.trim() || !email?.trim()) {
      return res.status(400).json({ error: "Name and email are required" });
    }

    const findeUser = users.find((user) => user.email === email);

    if (findeUser) {
      return res.status(400).json({ error: "User exists" });
    }

    const newUser = {
      id: users[users.length - 1].id + 1,
      name: name,
      email: email,
    };

    users.push(newUser);

    res.status(201).json({
      status: "New user created successfully",
      data: {
        newUser,
      },
    });
  },
);

// @desc update user
// @route PUT /api/users/:id
app.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  users[findUserIndex] = { id: users[findUserIndex].id, ...body };

  res.status(200).json({
    status: "Updated Successfully",
    data: {
      updated: users[findUserIndex],
    },
  });
});

// @desc partial update user
// @route PATCH /api/users/:id
app.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  users[findUserIndex] = { ...users[findUserIndex], ...body };

  res.status(200).json({
    status: "PATCH requested successfully",
    data: {
      updatedByPATCH: users[findUserIndex],
    },
  });
});

// @desc delete new user
// @route DELETE /api/users/:id
app.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;
  const deletedUser = users[findUserIndex];

  users.splice(findUserIndex, 1);

  res.status(200).json({
    status: "Deleted Successfully",
    data: {
      deleted: deletedUser,
    },
  });
});

// @desc Get all products
// @route GET /api/products
app.get("/api/products", (req, res) => {
  res.status(200).json(products);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
