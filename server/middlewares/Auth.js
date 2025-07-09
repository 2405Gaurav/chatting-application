import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
    if (error) {
      return res.status(403).json({ message: "Invalid token" });
    }

    req.userId = payload.userId;
    next();
  });
};
