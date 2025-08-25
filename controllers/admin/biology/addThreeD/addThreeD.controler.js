import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const bulkSaveModels = async (req, res) => {
  try {
    const models = req.body;
    const userId = req.params?.userId ? parseInt(req.params.userId) : null;

    console.log("Received models for bulk save:", models);
    if (!Array.isArray(models)) {
      return res.status(400).json({ error: "Invalid data format" });
    }

    // const savedModels = await Promise.all(
    //   models.map((m) =>
    //     prisma.threeModel.create({
        const savedModels = await prisma.threeModel.create({
     
          data: {
            uid: m.uid,
            name: m.name,
            thumbnail: m.thumbnail || "",
            category: m.category || null,
            subcategory: m.subcategory || null,
            embedUrl: m.embedUrl || null,
            uploaded_by: userId,
          },
        })
      

    res.json({ success: true, count: savedModels.length, models: savedModels });
  } catch (error) {
    console.error("❌ Error saving models:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all models
export const getAllModels = async (req, res) => {
  try {
    const models = await prisma.threeModel.findMany({
      include: { user: { select: { id: true, full_name: true, email: true } } },
    });
    res.json(models);
  } catch (error) {
    console.error("❌ Error fetching models:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get single model by ID
export const getModelById = async (req, res) => {
  try {
    const { id } = req.params;
    const model = await prisma.threeModel.findUnique({
      where: { id: Number(id) },
      include: { user: { select: { id: true, full_name: true, email: true } } },
    });

    if (!model) {
      return res.status(404).json({ error: "Model not found" });
    }

    res.json(model);
  } catch (error) {
    console.error("❌ Error fetching model:", error);
    res.status(500).json({ error: "Server error" });
  }
};
