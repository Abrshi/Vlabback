import express from "express";
import { signUp, signIn, logout, refreshToken } from "../../controllers/auth/auth.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", signIn);
router.post("/logout", logout);
router.post("/refresh", refreshToken);

// Example protected route
router.get("/me", authenticate, (req, res) => {
  res.json({ message: "Protected data", user: req.user });
});
export default router;
