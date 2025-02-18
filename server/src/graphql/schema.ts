import { gql } from "apollo-server-express";

export const typeDefs = gql`
  type User {
    id: ID!
    username: String!
  }

  type Todo {
    id: ID!
    title: String!
    description: String
    completed: Boolean!
  }

  type Query {
    getUser: User
    getTodos: [Todo]!
    getTodoById(id: ID!): Todo
  }

  type Mutation {
    signup(username: String!, password: String!): User
    login(username: String!, password: String!): User
    signout: Boolean
    createTodo(title: String!, description: String): Todo
    updateTodo(id: ID!, title: String!, description:String): Todo
    toggleTodo(id: ID!, completed: Boolean!): Todo
    deleteTodo(id: ID!): ID
  }
`;
