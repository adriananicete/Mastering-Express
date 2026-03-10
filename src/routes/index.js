import express from 'express';
import usersRouter from './users.js';
import productsRouter from './products.js';
import { verifyCookie } from '../middleware/verifyCookie.js';

const router = express.Router();


router.use('/api/users',verifyCookie, usersRouter);
router.use('/api/products', verifyCookie, productsRouter);

export default router;