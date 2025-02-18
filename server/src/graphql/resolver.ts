import { signup, login, signout } from "../services/auth.service.js";
import { getTodos, createTodo, updateTodo, deleteTodo, toggleTodo, getTodoById } from "../services/todo.service.js";
import type { GraphQLContext } from "../types/context";
import { User } from "types/user";
import { Todo } from "types/todo";

// Define Resolver Argument Types
interface SignupArgs {
  username: string
  password: string
}

interface LoginArgs {
  username: string
  password: string
}

interface TodoArgs {
  title: string
  description: string
}

interface UpdateTodoArgs {
  id: string
  title: string
  description: string
}

interface ToggleTodoArgs{
  id: string
  completed: boolean
}

interface DeleteTodoArgs {
  id: string
}

// Define Resolver Map
export const resolvers = {
  Query: {
    getUser: (_: unknown, __: unknown, { req }: GraphQLContext): User => {
      return req.session.user;
    },
    getTodos: async (_: unknown, __: unknown, { req }: GraphQLContext): Promise<Todo[]> => {
      if (!req.session.user) throw new Error("Unauthorized, please login");
      return getTodos(req.session.user.id);
    },
    getTodoById: async (_: unknown, { id }: { id: string }, { req }: GraphQLContext): Promise<Todo> => {
      if (!req.session.user) throw new Error("Unauthorized, please login");
    // console.log("here")
      const todo = await getTodoById(id);
      if (!todo) {
        throw new Error(`Todo with id ${id} not found`);
      }
      return todo;
    },
  },
  Mutation: {
    signup: async (_: unknown, { username, password }: SignupArgs): Promise<User> => {
      return signup(username, password);
    },
    login: async (_: unknown, { username, password }: LoginArgs, { req, res }: GraphQLContext): Promise<User> => {
      return login(username, password, req, res);
    },
    signout: async (_: unknown, __: unknown, { req, res }: GraphQLContext): Promise<boolean> => {
      return signout(req, res);
    },
    createTodo: async (_: unknown, { title , description}: TodoArgs, { req }: GraphQLContext): Promise<Todo> => {
      if (!req.session.user) throw new Error("Unauthorized");
      return createTodo(req.session.user.id, title, description);
    },
    updateTodo: async (_: unknown, { id, title , description}: UpdateTodoArgs, { req }: GraphQLContext): Promise<Todo> => {
      if (!req.session.user) throw new Error("Unauthorized");
      return updateTodo(id, title, description);
    },
    toggleTodo: async (_: unknown, { id, completed }: ToggleTodoArgs, { req }: GraphQLContext): Promise<Todo> => {
      if (!req.session.user) throw new Error("Unauthorized");
      return toggleTodo(id, completed);
    },
    deleteTodo: async (_: unknown, { id }: DeleteTodoArgs, { req }: GraphQLContext): Promise<string> => {
      if (!req.session.user) throw new Error("Unauthorized");
      return deleteTodo(id);
    },
  },
};
