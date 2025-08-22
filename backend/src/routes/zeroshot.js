import express from "express";
import { zeroShotPrompt } from "../controllers/zeroshotcontroller.js";

const router = express.Router();

router.post("/", zeroShotPrompt);

export { router as zeroShotRoutes };
