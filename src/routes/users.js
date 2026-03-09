import express from 'express';
import { body, matchedData, validationResult } from 'express-validator';
import { users } from '../utils/data.js';
import { resolveIndexByUserId } from '../middleware/usersMiddleware.js';

const router = express.Router();


// @desc Get all users
// @route GET /api/users
router.get("/", (req, res) => {
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
router.get("/:id", (req, res) => {
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
router.post(
  "/",
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
router.put("/:id", resolveIndexByUserId, (req, res) => {
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
router.patch("/:id", resolveIndexByUserId, (req, res) => {
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
router.delete("/:id", resolveIndexByUserId, (req, res) => {
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

export default router;