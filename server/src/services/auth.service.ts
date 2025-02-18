import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export async function signup(username: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  return prisma.user.create({ data: { username, password: hashedPassword } });
}

export async function login(username: string, password: string, req: Request, res: Response) {
  // Check user availability in database
  const user = await prisma.user.findUnique({ where: { username } });
  if (!user) throw new Error("User not found");

  // check validity of User
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw new Error("Invalid password");

  // Store user information in session
  req.session.user = { id: user.id, username: user.username };
  // Save session explicitly
  req.session.save((err) => {
    if (err) {
      console.error("Error saving session:", err);
      return;
    }
    console.log("Session saved successfully");
  });

  return user;
}

export async function signout(req: Request, res: Response) {
  req.session.destroy((err) => {
    if (err) console.error("signout Error:", err);
  });
  res.clearCookie("connect.sid");
  return true;
}
