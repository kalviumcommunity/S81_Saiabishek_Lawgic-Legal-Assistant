// backend/server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import { zeroShotRoutes } from "./src/routes/zeroshot.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// API route
app.use("/api/zeroshot", zeroShotRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
