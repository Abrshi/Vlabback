// routes/modelRoutes.js
import express from "express";
import {
  bulkSaveModels,
  getAllModels,
  getModelById,
} from "../../../../controllers/admin/biology/addThreeD/addThreeD.controler.js";

const router = express.Router();

router.post("/bulk/:userId", bulkSaveModels);
router.get("/", getAllModels);
router.get("/:id", getModelById);

export default router;
