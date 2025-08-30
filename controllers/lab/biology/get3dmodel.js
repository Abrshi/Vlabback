import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getAll3DModel = async (req, res) => {
  try {
    console.log("Fetching all 3D models...");

    const models = await prisma.threedmodel.findMany({
      // You can add filters, sorting, or select fields if needed
     orderBy: { created_at: "desc" }
    });

    return res.status(200).json(models);
  } catch (err) {
    console.error("Error fetching 3D models:", err);
    return res.status(500).json({ error: "Failed to fetch 3D models" });
  }
};
