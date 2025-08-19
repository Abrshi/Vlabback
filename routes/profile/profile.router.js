import { Router } from "express";
import {  profileData } from "../../controllers/profile/profile.js";
const authRouter = Router();

// Path: /api/v1/
authRouter.get('/profileData', profileData);

export default authRouter;