import express from "express";
import { createCategory } from "../controllers/CategoryController";

const router = express.Router();

router.post("/create", createCategory);

export default router;