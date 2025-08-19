import { Router } from "express";
import { signIn, signUp} from '../../controllers/auth.controller.js';
const authRouter = Router();

// Path: /api/v1/auth/sign-up,-in,-out
authRouter.post('/sign-up', signUp);
authRouter.post('/sign-in', signIn);

export default authRouter;

