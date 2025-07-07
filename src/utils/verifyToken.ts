import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
const SECRET_KEY = process.env.SECRET_KEY ?? '';
interface CustomRequest extends Request {
  user?: string | JwtPayload;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];
  // console.log("token di verify", token);
  if (!token) {
    res.status(403).json({ message: 'No token provided' });
    return
  }
  try {
    jwt.verify(token?.split(' ')[1]!, SECRET_KEY, (err: any, decoded: any) => {
      if (err) {
        res.status(401).json({ message: 'Unauthorized' });
        return
      }
      (req as CustomRequest).user = decoded;
      next();
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
    return
  }

}