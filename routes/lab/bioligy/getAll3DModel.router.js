import { Router } from "express";
import { getAll3DModel } from "../../../controllers/lab/biology/get3dmodel.js";
const authRouter = Router();

authRouter.get('/getAll3DModel', getAll3DModel);

export default authRouter;