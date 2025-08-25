import express from "express";
import { chainOfThoughtController } from "../controllers/cotcontroller.js";

const router = express.Router();

router.post("/", chainOfThoughtController);

export default router;
