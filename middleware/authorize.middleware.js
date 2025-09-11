// middleware/authorize.middleware.js
export const authorize = (roles = []) => {
  // roles can be a string or an array
  if (typeof roles === "string") {
    roles = [roles];
  }

  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: "Forbidden: insufficient rights" });
    }
    next();
  };
};
