import express from "express";
import { tokenController } from "../controllers/tokencontroller.js";

const router = express.Router();
router.post("/", tokenController);

export default router;
