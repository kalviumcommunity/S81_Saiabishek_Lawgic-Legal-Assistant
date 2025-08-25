import express from "express";
import { functionCallingController } from "../controllers/funcallcontroller.js";

const router = express.Router();

// POST /api/funcall
router.post("/", functionCallingController);

export default router;
