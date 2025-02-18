import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET as string;

// token generation
export const createToken = (userId: string) => {
  return jwt.sign({ userId }, SECRET_KEY, { expiresIn: "7d" });
};

// token verification using JWT_KEY
export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch {
    return null;
  }
};
