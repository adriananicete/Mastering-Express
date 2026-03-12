import express from 'express';
import { body, checkSchema, matchedData, validationResult } from 'express-validator';
import { users } from '../utils/data.js';
import { resolveIndexByUserId } from '../middleware/usersMiddleware.js';
import { User } from '../mongoose/schemas/users.js';
import { createUserValidationSchema } from '../utils/validationSchema.js';
import { hashPassword } from '../utils/helpers.js';

const router = express.Router();


// @desc Get all users
// @route GET /api/users
router.get("/", (req, res) => {
  console.log(req.session);
  console.log(req.session.id);
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
  "/", checkSchema(createUserValidationSchema),
  async (req, res) => {
    const result = validationResult(req);
    if(!result.isEmpty()) return res.send(result.array());

    const data = matchedData(req)
    console.log('Before hash',data);
    data.password = await hashPassword(data.password);
    console.log('After hash',data);
    const newUser = new User(data);

    try {
      const savedUser = await newUser.save();
      return res.status(201).json({
        status: 'Successfull',
        data: {
          savedUser
        }
      })
    } catch (error) {
      console.error(error);
      return res.sendStatus(400);
    }
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