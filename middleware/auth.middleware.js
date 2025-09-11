// middlewares/authMiddleware.js
import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  try {
    // Look for token in Authorization header or cookie
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"
    const cookieToken = req.cookies?.refreshToken; // optional, if you want to fallback

    const accessToken = token || cookieToken;
    if (!accessToken) {
      return res.status(401).json({ error: "No token, authorization denied" });
      console.log("No token, authorization denied");
    }

    // Verify token
    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Invalid or expired token" });
      }

      // Attach decoded user info to request
      req.user = decoded; // { userId, role, iat, exp }
      next();
    });
  } catch (err) {
    console.error("Auth middleware error:", err);
    res.status(500).json({ error: "Server error" });
    console.log("Server error");
  }
};
