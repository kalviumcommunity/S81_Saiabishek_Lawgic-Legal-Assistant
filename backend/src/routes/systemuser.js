import express from "express";
import { systemUserController } from "../controllers/systemusercontroller.js";

const router = express.Router();

router.post("/", systemUserController);

export default router;
