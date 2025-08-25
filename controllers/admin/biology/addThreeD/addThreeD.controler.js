import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const bulkSaveModels = async (req, res) => {
  try {
    const models = req.body;
    const userId = req.params?.userId ? parseInt(req.params.userId) : null;

    if (!Array.isArray(models) || models.length === 0) {
      return res.status(400).json({ error: "Invalid data format or empty array" });
    }

    // 1. Prepare data for createMany
    const modelsToCreate = models.map((m) => ({
      uid: m.uid,
      name: m.name,
      thumbnail: m.thumbnail || "",
      category: m.category || null,
      subcategory: m.subcategory || null,
      embedUrl: m.embedUrl || null,
      uploaded_by: userId, // ✅ Using snake_case to match schema
    }));

    // 2. Attempt to create all models in a single operation
    //    `skipDuplicates: true` will ignore models that already exist
    const createResult = await prisma.threeDModel.createMany({
      data: modelsToCreate,
      skipDuplicates: true,
    });

    // 3. Now, handle the models that already exist and need to be updated
    //    Get the UIDs of the models that were skipped
    const existingModelsUids = models.filter(m => 
      !createResult.count > 0 && 
      !modelsToCreate.find(c => c.uid === m.uid) // A bit more complex logic might be needed here to get the exact skipped UIDs.
    ).map(m => m.uid);

    // 4. Update the existing models. This is an example; you'd need to
    //    determine which records to update. `updateMany` doesn't take
    //    an array of update data for each record.
    //    A better approach might be a loop for `update` or creating a raw query.
    //
    //    For a more straightforward fix, use `Promise.all` with individual `upsert` calls:
    const savedModels = await Promise.all(
      models.map((m) =>
        prisma.threeDModel.upsert({ // ✅ Correct method
          where: { uid: m.uid },
          update: {
            name: m.name,
            thumbnail: m.thumbnail || "",
            category: m.category || null,
            subcategory: m.subcategory || null,
            embedUrl: m.embedUrl || null,
            uploaded_by: userId,
          },
          create: {
            uid: m.uid,
            name: m.name,
            thumbnail: m.thumbnail || "",
            category: m.category || null,
            subcategory: m.subcategory || null,
            embedUrl: m.embedUrl || null,
            uploaded_by: userId,
          },
        })
      )
    );

    res.json({ success: true, count: savedModels.length, models: savedModels });
  } catch (error) {
    console.error("❌ Error saving models:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all models
export const getAllModels = async (req, res) => {
  try {
    const models = await prisma.threeDModel.findMany({
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
    const model = await prisma.threeDModel.findUnique({
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
