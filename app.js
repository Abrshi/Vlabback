// app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import helmet from "helmet";
import { fileURLToPath } from "url";
import pool from "./db.js";

import authRouter from "./routes/auths/auth.routes.js";
import chemicalReaction  from "./routes/lab/chmistry/chemicalRiacction.router.js";
import getAll3DModel  from "./routes/lab/bioligy/getAll3DModel.router.js";
import labHistory  from "./routes/profile/labHistory.router.js";
import profile  from "./routes/profile/profile.router.js";
import activityRoutes from "./routes/activity/activity.js";
import addThreeDRouter from "./routes/admin/biology/addThreeD/addThreeD.route.js";

import userRoutes from "./routes/admin/user/user.routes.js";
// import { getAll3DModel } from "./controllers/lab/biology/get3dmodel.js";
// middleware 
import { authenticate } from "./middleware/auth.middleware.js"; // adjust path
import { authorize } from "./middleware/authorize.middleware.js";

// Load environment variables
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5500;

// For serving static files (if needed later)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, "public")));

// Security headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: ["http://localhost:3001", "https://vlabeth.netlify.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// JSON body parser
app.use(express.json());

// Base route
app.get("/", (req, res) => {
  res.send({ message: "V-Lab Ethiopia API is running..." });
});

// ---------- API Routes ----------

// Public
app.use("/api/v1/auth", authRouter);

// User-protected
app.use(
  "/api/v1/chemistry/chmistry/chemicalReaction",
   
  
  chemicalReaction
);
app.use(
  "/api/v1/biology/threeD",
   
  
  getAll3DModel
);
app.use(
  "/api/v1/profile/lab-history",
   
  
  labHistory
);
app.use(
  "/api/v1/profile",
   
  
  profile
);

app.use(
  "/api/v1/activity",
  
  activityRoutes
);
app.use(
  "/api/v1/admin/biology/add-threeD",
   
  
  addThreeDRouter
);
app.use(
  "/api/v1/admin/users",
 authenticate
);

// ---------- Error & 404 Handling ----------

// 404 handler
app.use((req, res) => {
  console.warn(`⚠️ 404 - ${req.method} ${req.originalUrl}`);
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("💥 Server Error:", err.stack || err.message);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal server error" });
});

// ---------- DB Connection Test ----------
(async () => {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("✅ Database connected. Current time:", result.rows[0]);
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

// ---------- Start Server ----------
app.listen(PORT, () => {
  if (process.env.NODE_ENV === "development") {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  } else {
    console.log(`✅ Server running on port ${PORT}`);
  }
});

export default app;
