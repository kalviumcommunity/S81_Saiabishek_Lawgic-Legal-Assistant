import express from "express";
import { dynamicPromptController } from "../controllers/dynamiccontroller.js";

const router = express.Router();

router.post("/", dynamicPromptController);

export default router;
