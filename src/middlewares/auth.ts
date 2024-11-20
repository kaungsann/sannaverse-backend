import jwt, { JwtPayload } from "jsonwebtoken";

import { Request, Response, NextFunction } from "express";

interface DecodedToken extends JwtPayload {
  userId: string;
}

const auth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      res.status(401).json({ error: "Unauthorized - No token provided" });
      return;
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY) as DecodedToken;

    if (!decoded) {
      res.status(401).json({ error: "Unauthorized - Invalid Token" });
      return;
    }
    next();
  } catch (error: any) {
    console.log("Error in protectRoute middleware", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default auth;
