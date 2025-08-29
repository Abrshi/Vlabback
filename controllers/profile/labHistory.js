import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient(); 

export const chlabHistory = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }
  console.log("Fetching lab history for user ID:", userId);

  try {
    const experiments = await prisma.chemicalreactionresult.findMany({
      where: { user_id: parseInt(userId) },
      orderBy: { created_at: "desc" },
      include: {
        user: {
          select: { id: true, full_name: true, email: true }, // 👈 optional
        }
      }
    });

    res.json({ experiments });
    console.log("Lab history fetched successfully:", experiments);

  } catch (err) {
    console.error("Error fetching lab history:", err);
    res.status(500).json({ error: "Failed to fetch experiments" });
  }
};