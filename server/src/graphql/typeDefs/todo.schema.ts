import { gql } from "apollo-server-express";

export const todoSchema = gql`
  type Todo {
    id: ID!
    title: String!
    status: Boolean!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    getTodos: [Todo]
  }

  type Mutation {
    createTodo(title: String!): Todo
    toggleTodo(id: ID!): Todo
    deleteTodo(id: ID!): String
  }
`;
