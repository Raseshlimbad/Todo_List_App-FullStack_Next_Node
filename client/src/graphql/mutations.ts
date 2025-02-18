import { gql } from "@apollo/client";

// definition of mutations according to backend schema and resolve


// server mutations
// createTodo(title: String!): Todo
//     updateTodo(id: ID!, completed: Boolean!): Todo
//     deleteTodo(id: ID!): Boolean
// toggleTodo(id: ID!, completed: Boolean!): Todo

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      id
      username
    }
  }
`;
export const SIGNUP = gql`
  mutation Signup($username: String!, $password: String!) {
    signup(username: $username, password: $password) {
      id
      username
    }
  }
`;


export const SIGNOUT_USER = gql`
  mutation Signout {
    signout
  }
`;


export const CREATE_TODO = gql`
  mutation CreateTodo($title: String!, $description: String) {
    createTodo(title: $title, description: $description) {
      id
      title
      completed
      description
    }
  }
`;

export const TOGGLE_TODO = gql`
  mutation ToggleTodo($id: ID!, $completed: Boolean!) {
    toggleTodo(id: $id, completed: $completed) {
      id
      title
      completed
    }
  }
`;

export const UPDATE_TODO = gql`
  mutation UpdateTodo($id: ID!, $title: String!, $description: String) {
    updateTodo(id: $id, title: $title, description: $description) {
      id
      title
      description
    }
  }
`;

export const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`;
