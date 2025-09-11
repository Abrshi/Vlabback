import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

const generateAccessToken = (user) =>
  jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "5m",
  });

const generateRefreshToken = (user) =>
  jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

// --- Signup ---
export const signUp = async (req, res) => {
  const { full_name, email, password } = req.body;

  if (!full_name || !email || !password)
    return res.status(400).json({ error: "All fields required" });
    console.log("error here",req.body);

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email already in use" });
    console.log("existing:", existing);

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { full_name, email, password: hashedPassword },
    });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await prisma.session.create({
      data: { user_id: user.id, refresh_token: refreshToken },
    });

    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
      })
      .json({ accessToken, user: { id: user.id, full_name, email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
    console.error("Signup error:", err);
  }
};

// --- Login ---
// 🔹 Login
export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // save refresh token in DB (so you can revoke later)
    await prisma.session.create({
      data: { user_id: user.id, refresh_token: refreshToken },
    });

    // send refresh token as HttpOnly cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // send access token + user info in JSON
    res.json({
      accessToken,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};

// 🔹 Refresh Access Token
export const refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: "No refresh token" });

  try {
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    const session = await prisma.session.findFirst({
      where: { user_id: payload.userId, refresh_token: token },
    });
    if (!session) return res.status(403).json({ error: "Invalid refresh token" });

    const user = await prisma.user.findUnique({ where: { id: payload.userId } });
    if (!user) return res.status(404).json({ error: "User not found" });

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    console.error(err);
    res.status(403).json({ error: "Invalid refresh token" });
  }
};



// --- Logout ---
export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);

  try {
    await prisma.session.deleteMany({ where: { refresh_token: refreshToken } });
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
  } catch (err) {
    res.status(500).json({ error: "Logout failed" });
  }
};

// --- Refresh ---
// export const refreshToken = async (req, res) => {
//   const refreshToken = req.cookies.refreshToken;
//   if (!refreshToken) return res.status(401).json({ error: "No refresh token" });

//   try {
//     const session = await prisma.session.findUnique({ where: { refresh_token: refreshToken } });
//     if (!session) return res.status(403).json({ error: "Invalid refresh token" });

//     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
//       if (err) return res.status(403).json({ error: "Invalid refresh token" });

//       const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
//       if (!user) return res.status(404).json({ error: "User not found" });

//       const newAccessToken = generateAccessToken(user);
//       res.json({ accessToken: newAccessToken });
//     });
//   } catch (err) {
//     res.status(500).json({ error: "Refresh failed" });
//   }
// };
