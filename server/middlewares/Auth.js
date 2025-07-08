import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    console.log(req.cookies);
  const token = req.cookies.jwt;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    jwt.verify(token,process.env.JWT_SECRET,async (error,payload)=>{
         if(error) res.status(403).send("Token is Not valid")
            req.userId=payload.userId;
        next();
    });
    next();
  } catch (error) {
    console.error("Token Verification Error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};
