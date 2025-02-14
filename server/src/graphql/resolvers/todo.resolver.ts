import prisma from "../../config/db.js";
import { Request } from "express";

export const todoResolver = {
  Query: {
    getTodos: async (_: any, __: any, { req }: { req: Request }) => {
      if (!req.session.userId) throw new Error("Not authenticated");
      return await prisma.todo.findMany({ where: { userId: req.session.userId } });
    },
  },
  Mutation: {
    createTodo: async (_: any, { title }: any, { req }: { req: Request }) => {
      if (!req.session.userId) throw new Error("Not authenticated");
      return await prisma.todo.create({ data: { title, userId: req.session.userId } });
    },
    toggleTodo: async (_: any, { id }: any, { req }: { req: Request }) => {
      if (!req.session.userId) throw new Error("Not authenticated");
      const todo = await prisma.todo.findUnique({ where: { id } });
      return await prisma.todo.update({ where: { id }, data: { status: !todo?.status } });
    },
    deleteTodo: async (_: any, { id }: any, { req }: { req: Request }) => {
      if (!req.session.userId) throw new Error("Not authenticated");
      await prisma.todo.delete({ where: { id } });
      return "Todo deleted successfully";
    },
  },
};
