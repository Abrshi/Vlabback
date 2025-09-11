import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
// db test
import pool from './db.js';

// // Import my routers
import authRouter from "./routes/auths/auth.routes.js";
import chemicalReaction  from "./routes/lab/chmistry/chemicalRiacction.router.js";
import getAll3DModel  from "./routes/lab/bioligy/getAll3DModel.router.js";
import labHistory  from "./routes/profile/labHistory.router.js";
import profile  from "./routes/profile/profile.router.js";
import activityRoutes from "./routes/activity/activity.js";
import addThreeDRouter from "./routes/admin/biology/addThreeD/addThreeD.route.js";
// import { getAll3DModel } from "./controllers/lab/biology/get3dmodel.js";
// middleware 
import { authenticate } from "./middleware/auth.middleware.js"; // adjust path
import { authorize } from "./middleware/authorize.middleware.js";

// // Initialize environment
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5500;

// For serving static files (if needed later)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Uncomment if you want to serve static files from a "public" folder
// app.use(express.static(path.join(__dirname, "public")));

// CORS configuration
app.use(cors({
  origin: ["http://localhost:3000","https://vlabeth.netlify.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Handle preflight requests
// app.options("*", cors());

// JSON body parser
app.use(express.json());

// Base route
app.get("/", (req, res) => {
  res.send({ message: "V-Lab Ethiopia API is running..." });
});

// API routes
app.use("/api/v1/auth",  authRouter);
app.use("/api/v1/chemistry/chmistry", authenticate, authenticate, authorize("user"), chemicalReaction);
app.use("/api/v1/biology/threeD",authenticate, authenticate, authorize("user"), getAll3DModel);
app.use("/api/v1/profile/labHistory", authenticate, authenticate, authorize("user"), labHistory);
app.use("/api/v1/profile/profile", authenticate, authenticate, authorize("user"), profile);
app.use("/api/v1/activity", authenticate, authenticate, authorize("admin"), activityRoutes);
app.use("/api/v1/admin/biology/addThreeD", authenticate, authenticate, authorize("admin"), addThreeDRouter);

// 404 handler
app.use((req, res) => {
  console.warn(`⚠️ 404 - ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("💥 Server Error:", err.stack || err.message);
  res.status(500).json({ message: "Internal server error" });
});

(async () => {
  const result = await pool.query("SELECT NOW()");
  console.log("Current time:", result.rows[0]);
})();

// Start server
app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  }
});

export default app;
