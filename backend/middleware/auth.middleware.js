import jwt from "jsonwebtoken";
import redisClient from "../services/redis.service.js";

export const authUser = async (req, res, next) => {
  try {
    let token = null;

    // ✅ 1. Pehle Authorization header check karo (frontend se yahi aa raha hai)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // ✅ 2. Agar header me nahi mila, tab cookie check karo
    if (!token && req.cookies.token) {
      token = req.cookies.token;
    }

    // ❌ Token hi nahi mila
    if (!token) {
      return res.status(401).json({ error: "Unauthorized User - No Token" });
    }

    // ✅ 3. Redis blacklist check (Safe handling)
    try {
      const isBlackListed = await redisClient.get(token);
      if (isBlackListed) {
        res.clearCookie("token");
        return res
          .status(401)
          .json({ error: "Unauthorized User - Token Blacklisted" });
      }
    } catch (redisError) {
      console.error("Redis Blacklist Check Error (Skipping):", redisError.message);
      // We skip the blacklist check if Redis is down to allow legitimate users access
    }

    // ✅ 4. JWT verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(401).json({ error: "Unauthorized User - Invalid Token" });
  }
};
