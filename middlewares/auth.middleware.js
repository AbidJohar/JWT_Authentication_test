import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    // Read token from httpOnly cookie
    const token = req.cookies?.accessToken;
    console.log("token:",token);
    

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};