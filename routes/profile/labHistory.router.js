import { Router } from "express";
import { chlabHistory } from "../../controllers/profile/labHistory.js";
const authRouter = Router();

// Path: /api/v1/auth/sign-up,-in,-out
authRouter.get('/chlabHistory', chlabHistory);

export default authRouter;