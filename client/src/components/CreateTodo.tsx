"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import { CREATE_TODO } from "@/graphql/mutations";
import { GET_TODOS } from "@/graphql/queries";
import { MdAddTask } from "react-icons/md";

export default function CreateTodo() {
  const [title, setTitle] = useState(""); // for todo title state management
  const [description, setDescription] = useState(""); // for todo description state management

  // createTodo mutation function
  const [createTodo, { loading, error }] = useMutation(CREATE_TODO, {
    update(cache, { data }) {
      if (!data) return;

      const newTodo = data.createTodo;
      const existingTodos = cache.readQuery<{
        getTodos: { id: string; title: string; completed: boolean }[];
      }>({ query: GET_TODOS });

      if (existingTodos) {
        cache.writeQuery({
          query: GET_TODOS,
          data: {
            getTodos: [...existingTodos.getTodos, newTodo],
          },
        });
      }
    },
    onCompleted: () => {
      setTitle("");
      setDescription(""); 
    },
    onError: (err) => {
      console.error("Error creating todo:", err);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createTodo({ variables: { title, description } });
  };

  return (
    <div className="bg-white p-4 shadow-md rounded-lg">
      <h2 className="font-semibold mb-3 text-2xl text-gray-800">
        Create New Todo
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="flex gap-3">

          {/* Create Todo input field */}
        <input
          type="text"
          placeholder="Todo Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-gray-400"
          required
        />

        {/* submit button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-gray-700 text-white px-4 py-2 rounded font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition"
        >
          {loading ? "Creating..." : <MdAddTask />}
        </button>
        </div>

        {/* Enable description optional when title  */}
        {title && (
          <textarea
            placeholder="Todo Description (Optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded w-full h-24 resize-none focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        )}

        {/* display error message */}
        {error && <p className="text-red-500 text-sm">{error.message}</p>}
      </form>
    </div>
  );
}
