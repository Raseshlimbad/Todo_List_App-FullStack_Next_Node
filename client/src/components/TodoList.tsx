"use client";
import { useQuery, useMutation } from "@apollo/client";
import { GET_TODOS } from "@/graphql/queries";
import { DELETE_TODO, TOGGLE_TODO, UPDATE_TODO } from "@/graphql/mutations";
import { useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import { IoCheckmarkDoneCircle } from "react-icons/io5";

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

export default function TodoList() {
  const { data, loading, error } = useQuery<{ getTodos: Todo[] }>(GET_TODOS);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [updatedTitle, setUpdatedTitle] = useState("");

  const [toggleTodo] = useMutation(TOGGLE_TODO);
  const [updateTodo] = useMutation(UPDATE_TODO, {
    onCompleted: () => setEditingId(null),
  });
  const [deleteTodo] = useMutation(DELETE_TODO, {
    update(cache, { data }) {
      if (!data || !data.deleteTodo) return;
  
      const deletedTodoId = data.deleteTodo; // Get the deleted ID
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
  

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  return (
    <div className="mx-auto mt-4 bg-white max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 ">
      <ul className="space-y-2 p-2">
        {data?.getTodos.length ? (
          data.getTodos.map((todo) => (
            <li
              key={todo.id}
              className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3 p-3 shadow-sm border-0 border-t-2 border-l-2 border-gray-300  hover:bg-gray-100 transition "
            >
              {/* Checkbox */}
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() =>
                  toggleTodo({ variables: { id: todo.id, completed: !todo.completed } })
                }
                className="h-5 w-5 text-gray-700 focus:ring-gray-700 cursor-pointer"
              />

              {/* Editable Title */}
              {editingId === todo.id ? (
                <input
                  type="text"
                  value={updatedTitle}
                  onChange={(e) => setUpdatedTitle(e.target.value)}
                  className="border px-2 py-1  w-full"
                />
              ) : (
                <button
                  className={`text-lg ${
                    todo.completed ? "line-through text-gray-500 transition" : "text-gray-800"
                  }`}
                >
                  {todo.title}
                </button>
              )}

              {/* Edit Button */}
              {editingId === todo.id ? (
                <button
                  onClick={() =>
                    updateTodo({ variables: { id: todo.id, title: updatedTitle } })
                  }
                  className="text-black border-gray-300 border-l-2 p-2 hover:bg-gray-300 transition"
                >
                  <IoCheckmarkDoneCircle />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setEditingId(todo.id);
                    setUpdatedTitle(todo.title);
                  }}
                  className="text-black border-gray-300 border-l-2 p-2 hover:bg-gray-300 transition "
                >
                  <FaEdit />
                </button>
              )}

              {/* Delete Button */}
              <button
                onClick={() => deleteTodo({ variables: { id: todo.id } })}
                className="text-black border-gray-300 border-l-2 p-2 hover:bg-gray-300 transition"
              >
                <FaTrash />
              </button>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">No todos found.</p>
        )}
      </ul>
    </div>
  );
}
