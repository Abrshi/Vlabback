import express from "express";
import { getUserStats } from "../../../controllers/admin/user/user.controller.js";

const router = express.Router();

// Route to get total users, admins, and normal users
router.get("/data", getUserStats);

export default router;
