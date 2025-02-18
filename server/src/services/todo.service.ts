import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getTodos(userId: string) {
  return prisma.todo.findMany({ where: { userId } });
}

export async function getTodoById(id: string) {
  const todo = await prisma.todo.findUnique({
    where: { id },
  });
  if (!todo) {
    throw new Error(`Todo with id ${id} not found`);
  }
  return todo;
}

export async function createTodo(userId: string, title: string ,description: string) {
  return prisma.todo.create({ data: { title, userId, description } });
}

export async function updateTodo(id: string, title: string, description: string) {
  return prisma.todo.update({ where: { id }, data: { title , description} });
}

export async function toggleTodo(id: string, completed: boolean) {
  return prisma.todo.update({ where: { id }, data: { completed } });
}

export async function deleteTodo(id: string): Promise<string> {
  await prisma.todo.delete({ where: { id } });
  return id; // Return the deleted ID
}
