import { gql } from "apollo-server-express";

export const userSchema = gql`
  type User {
    id: ID!
    email: String!
    username: String!
    createdAt: String!
  }

  type Query {
    getUser: [User]
  }

  type Mutation {
    signup(email: String!, username: String!, password: String!): String!
    login(email: String!, password: String!): String!
    logout: String!
  }
`;
