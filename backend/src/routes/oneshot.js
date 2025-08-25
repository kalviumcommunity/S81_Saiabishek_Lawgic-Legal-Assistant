// backend/src/routes/oneshot.js
import express from "express";
import { oneShotPrompt } from "../controllers/oneshotcontroller.js";

const router = express.Router();
router.post("/", oneShotPrompt);

export { router as oneShotRoutes };
