import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const getUserStats = async (req, res) => {
  try {
    // Fetch all users
    const users = await prisma.user.findMany({
      select: {
        full_name: true,
        role: true,
      },
    });

    // Separate users by role
    const admins = users.filter(u => u.role === 'admin');
    const normalUsers = users.filter(u => u.role === 'user');

    // Prepare response
    const response = {
      totalUsers: users.length,
      totalAdmins: admins.length,
      totalNormalUsers: normalUsers.length,
      adminNames: admins.map(u => u.full_name),
      normalUserNames: normalUsers.map(u => u.full_name),
    };

    res.json(response);
  } catch (error) {
    console.error("❌ Error fetching user stats:", error);
    res.status(500).json({ error: "Server error" });
  }
};
