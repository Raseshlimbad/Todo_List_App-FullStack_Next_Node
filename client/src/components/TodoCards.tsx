"use client";

import { useQuery, useMutation } from "@apollo/client";
import { GET_TODOS } from "@/graphql/queries";
import { DELETE_TODO, TOGGLE_TODO } from "@/graphql/mutations";
import { FaTrash } from "react-icons/fa";
import Link from "next/link";

// type definations
interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
}

export default function TodoCards() {
  // Tofo fetch query
  const { data, loading, error } = useQuery<{ getTodos: Todo[] }>(GET_TODOS);

  // Toggel Todo mutation
  const [toggleTodo] = useMutation(TOGGLE_TODO);

  // Delete Todo mutation
  const [deleteTodo] = useMutation(DELETE_TODO, {
    update(cache, { data }) {
      if (!data || !data.deleteTodo) return;

      const deletedTodoId = data.deleteTodo;
      const existingTodos = cache.readQuery<{ getTodos: Todo[] }>({ query: GET_TODOS });

      if (existingTodos) {
        cache.writeQuery({
          query: GET_TODOS,
          data: {
            getTodos: existingTodos.getTodos.filter((todo) => todo.id !== deletedTodoId),
          },
        });
      }
    },
  });

  // display loading and error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div className="mx-auto mt-4 bg-white max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Display todos in form for cards */}
        {data?.getTodos.length ? (
          data.getTodos.map((todo) => (
            <div
              key={todo.id}
              className="p-4 border rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 transition"
            >

              {/* Title */}
              <Link href={`/todo/${todo.id}`}>
              <h3 className="text-xl font-semibold text-gray-800">{todo.title}</h3>
                </Link>

              {/* Description (Truncated) */}
              {todo.description && (
                <p className="text-gray-600 mt-2">
                  {todo.description.length > 50
                    ? `${todo.description.slice(0, 50)}...`
                    : todo.description}
                </p>
              )}

              {/* Actions */}
              <div className="mt-3 flex items-center gap-3">
                {/* Toggle Completed */}
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() =>
                    toggleTodo({ variables: { id: todo.id, completed: !todo.completed } })
                  }
                  className="h-5 w-5 text-gray-700 focus:ring-gray-700 cursor-pointer"
                />

                {/* Delete Button */}
                <button
                  onClick={() => deleteTodo({ variables: { id: todo.id } })}
                  className="text-black border p-2 rounded hover:bg-gray-300 transition"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))
        ) : (
          // Incase todo returns empty array
          <p className="text-center text-gray-500 col-span-2">No todos found.</p>
        )}
      </div>
    </div>
  );
}
