import express from "express";
import { Router } from "express";
import { products } from "../utils/data.js";

const router = Router();

// @desc Get all products
// @route GET /api/products
router.get("/", (req, res) => {
  res.status(200).json(products);
});

export default router;
