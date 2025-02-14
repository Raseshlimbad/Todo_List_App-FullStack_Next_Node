import bcrypt from "bcryptjs";
import prisma from "../../config/db.js";
import { Request } from "express";

export const userResolver = {
  Query: {
    // with authantication to fetch loged in user
    // getUser: async (_: any, __: any, { req }: { req: Request }) => {
    //   if (!req.session.userId) throw new Error("Not authenticated");
    //   return await prisma.user.findUnique({ where: { id: req.session.userId } });
    // },

    // to get id without authorization
    getUser: async (_: any, { id }: { id: string }) => {
        // const user = await prisma.user.findFirst();
        // // const user = await prisma.user.findMany();
      
        // if (!user) throw new Error("User not found");
      
        // // return user.map((u) => ({ ...u}))
        // return user;
        return await prisma.user.findMany();
      },
  },
  Mutation: {
    signup: async (_: any, { email, username, password }: any) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.create({ data: { email, username, password: hashedPassword } });
      return "User registered successfully";
    },
    login: async (_: any, { email, password }: any, { req }: { req: Request }) => {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password))) throw new Error("Invalid credentials");

      req.session.userId = user.id;
      return "Login successful";
    },
    logout: async (_: any, __: any, { req }: { req: Request }) => {
      req.session.destroy((err) => err && console.log(err));
      return "Logout successful";
    },
  },
};
