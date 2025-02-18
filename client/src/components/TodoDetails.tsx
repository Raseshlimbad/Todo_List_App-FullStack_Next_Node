"use client"; // Since we use hooks, this must be a client component

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useQueryClient } from "@tanstack/react-query";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoCheckmarkDoneCircle } from "react-icons/io5";

import { GET_TODO_BY_ID, GET_TODOS } from "@/graphql/queries";
import { DELETE_TODO, UPDATE_TODO } from "@/graphql/mutations";
import { useRouter } from "next/navigation";
import { MdCancel } from "react-icons/md";

// type definations
interface Todo {
  id: string;
  title: string;
  description?: string;
}

// Prop type defination
interface TodoDetailsProps {
  todoId: string;
}

export default function TodoDetails({ todoId }: TodoDetailsProps) {
  const router = useRouter();
  console.log("TodoId: ", todoId);
  const queryClient = useQueryClient();

  // fetch todo details by id query
  const { data, loading, error } = useQuery<{ getTodoById: Todo }>(
    GET_TODO_BY_ID,
    {
      variables: { id: todoId },
      skip: !todoId, // Skip query if no todoId
    }
  );

  const [editing, setEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState("");
  const [updatedDescription, setUpdatedDescription] = useState("");

  // Update Todo Mutation
  const [updateTodo] = useMutation(UPDATE_TODO, {
    onCompleted: () => {
      setEditing(false);
      queryClient.invalidateQueries({ queryKey: ["todo", todoId] });
    },
  });
  const handleUpdateTodo = async () => {
    try {
      await updateTodo({
        variables: {
          id: todoId,
          title: updatedTitle,
          description: updatedDescription,
        },
      });
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const [deleteTodo] = useMutation(DELETE_TODO, {
    onCompleted: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] }); // Correct
    },
    refetchQueries: [{ query: GET_TODOS }], // Should be outside onCompleted
    awaitRefetchQueries: true,
  });

  const handleDeleteTodo = async () => {
    try {
      await deleteTodo({ variables: { id: todoId } });
      router.push("/"); // Redirect to home after deletion
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Function to cancel editing
  const handleCancelEdit = () => {
    setEditing(false);
    setUpdatedTitle("");
    setUpdatedDescription("");
  };

  // Display loading or error states
  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error.message}</p>;

  const todo = data?.getTodoById;

  return (
    <div className="mx-auto mt-6 p-6 border rounded-lg shadow-sm bg-white">
      {/* Edot todos section */}
      {editing ? (
        <div>
          {/* Edit title field */}
          <input
            type="text"
            value={updatedTitle}
            onChange={(e) => setUpdatedTitle(e.target.value)}
            className="w-full p-2 border rounded mb-2"
            placeholder="Update Title"
          />
          {/* Edit description field */}
          <textarea
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Update Description"
            rows={10}
          />
          {/* Save edits button */}
          <button
            onClick={handleUpdateTodo}
            className="mt-2 bg-gray-700 text-white px-4 py-2 rounded mr-2"
          >
            <IoCheckmarkDoneCircle className="inline mr-2" />
            Save
          </button>
          {/* Cancel Edits button */}
          <button
            onClick={handleCancelEdit}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            <MdCancel className="inline mr-2" />
            Cancel
          </button>
        </div>
      ) : (
        // Display Todo is not edition
        <div>
          {/* Display title */}
          <h2 className="text-2xl font-bold text-gray-800">
            {todo?.title || "No title available"}
          </h2>
          {/* display description */}
          <p className="text-gray-600 mt-2">
            {todo?.description || "No description available."}
          </p>

          {/* Edit Todo button */}
          <div className="mt-4 flex gap-4">
            <button
              onClick={() => {
                setEditing(true);
                setUpdatedTitle(todo?.title || "");
                setUpdatedDescription(todo?.description || "");
              }}
              className="text-gray-700 border p-2 rounded hover:bg-gray-100 transition"
            >
              <span className="flex gap-2 justify-center">
                <FaEdit /> Edit
              </span>
            </button>

            {/* Delete Todo button */}
            <button
              onClick={handleDeleteTodo}
              className="text-red-500 border p-2 rounded hover:bg-red-100 transition"
            >
              <span className="flex gap-2 justify-center">
                <FaTrash /> Delete
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
