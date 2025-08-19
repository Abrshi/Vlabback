import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const trackTime = async (req, res) => {
  try {
   const { userId, timeSpent } = req.body; // get both from body
    console.log("Tracking time:", { userId, timeSpent });
    if (!timeSpent) {
      return res.status(400).json({ error: "timeSpent is required" });
    }

   await prisma.userActivity.upsert({
  where: { user_id: userId },
  update: { totalTime: { increment: parseInt(timeSpent, 10) } },
  create: {
    user_id: userId,
    totalTime: parseInt(timeSpent, 10),
  },
});


    res.json({ message: "Time logged successfully" });
  } catch (error) {
    console.error("Error saving time:", error);
    res.status(500).json({ error: "Server error" });
  }
};
