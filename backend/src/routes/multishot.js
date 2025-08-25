// backend/src/routes/multishot.js
import express from "express";
import { multiShotPrompt } from "../controllers/multishotcontroller.js";

const router = express.Router();
router.post("/", multiShotPrompt);

export { router as multiShotRoutes };
