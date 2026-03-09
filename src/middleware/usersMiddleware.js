import { users } from "../utils/data.js";

const loggerMiddleware = (req, res, next) => {
  console.log(`${req.method} - ${req.url}`);
  next();
};

const loggerPostMiddleware = (req, res, next) => {
  console.log(`This is a ${req.method} request`);
  next();
};

const resolveIndexByUserId = (req, res, next) => {
  const { id } = req.params;

  const parsedId = parseInt(id);

  if(isNaN(parsedId)) return res.status(400).json({error: 'It must have an Id'});

  const findUserIndex = users.findIndex(user => user.id === parsedId);

  if(findUserIndex === -1) return res.status(404).json({error: 'Index not found'});

  req.findUserIndex = findUserIndex;
  next();
}

export {loggerMiddleware, loggerPostMiddleware, resolveIndexByUserId };