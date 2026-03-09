import express from 'express';
import usersRouter from './users.js';
import productsRouter from './products.js';

const router = express.Router();


router.use('/api/users', usersRouter);
router.use('/api/products', productsRouter);

export default router;