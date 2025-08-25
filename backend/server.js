// backend/server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import { zeroShotRoutes } from "./src/routes/zeroshot.js";
import { oneShotRoutes } from "./src/routes/oneshot.js";  
import { multiShotRoutes } from "./src/routes/multishot.js";
import funcallRoute from "./src/routes/funcall.js";
import cotRoute from "./src/routes/cot.js";
import systemUserRoute from "./src/routes/systemuser.js";



dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// API route
app.use("/api/zeroshot", zeroShotRoutes);
app.use("/api/oneshot", oneShotRoutes); 
app.use("/api/multishot", multiShotRoutes);
app.use("/api/funcall", funcallRoute);
app.use("/api/cot", cotRoute);
app.use("/api/systemuser", systemUserRoute);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
