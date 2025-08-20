import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
// // Import your routers
import authRouter from "./routes/auths/auth.router.js";
import chemicalReaction  from "./routes/lab/chmistry/chemicalRiacction.router.js";
import labHistory  from "./routes/profile/labHistory.router.js";
import profile  from "./routes/profile/profile.router.js";
import activityRoutes from "./routes/activity/activity.js";

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
  origin: ["https://vlabeth.netlify.app"],
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
  res.send({ message: "SafeGuard Ethiopia API is running..." });
});

// API routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/chemistry/chmistry", chemicalReaction);
app.use("/api/v1/profile/labHistory", labHistory);
app.use("/api/v1/profile/profile", profile);
app.use("/api/v1/activity", activityRoutes);
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

// Start server
app.listen(PORT, () => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  }
});

export default app;
