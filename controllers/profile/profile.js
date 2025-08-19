import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const profileData = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    console.log("Fetching lab history for user ID:", userId);

    // Get experiments
    const experiments = await prisma.experimentStats.findMany({
      where: { user_id: Number(userId) },
    });

    // Get time spent
    const timeSpentRecords = await prisma.userActivity.findMany({
      where: { user_id: Number(userId) },
    });

    const totalTime = timeSpentRecords[0]?.totalTime || 0;

    console.log(
      "Lab history -> experiments:",
      experiments[0]?.count || 0,
      "timeSpent:",
      totalTime
    );
    const count = experiments[0]?.count || 0;

    return res.status(200).json({
      experiments: count, // send count only
      timeSpent: totalTime,
    });
  } catch (err) {
    console.error("Error fetching lab history:", err);
    return res.status(500).json({ error: "Failed to fetch lab history" });
  }
};
