// routes.js
import express from "express";
import { trackTime } from "../../controllers/activity/activity.js";

const router = express.Router();

router.post("/track-time", trackTime);

export default router;
