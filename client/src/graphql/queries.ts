import { gql } from "@apollo/client";

// definition of quries according to backend schema and resolvers
export const GET_TODOS = gql`
  query GetTodos {
    getTodos {
      id
      title
      completed
      description
    }
  }
`;

export const GET_TODO_BY_ID = gql`
query GetTodoById($id: ID!) {
  getTodoById(id: $id) {
    id
    title
    description
  }
}
`;

export const GET_CURRENT_USER = gql`
  query GetCurrentUser {
    getUser {
      id
      username
    }
  }
`;



