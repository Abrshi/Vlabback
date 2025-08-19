import { Router } from "express";
import { chemicalReaction } from "../../../controllers/lab/chmistry/chemicalRiacction.controller.js";
const authRouter = Router();

// Path: /api/v1/auth/sign-up,-in,-out
authRouter.post('/chemicalReaction', chemicalReaction);

export default authRouter;