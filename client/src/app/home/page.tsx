import CreateTodo from "@/components/CreateTodo";
import TodoCards from "@/components/TodoCards";
// import TodoList from "@/components/TodoList";

export default function Home() {
  return (
      <div className="rounded shadow-md border-0 border-l-2 border-t-2 border-gray-300 p-10 max-h-[900px]">
        {/* component calls */}

        <CreateTodo />
        {/* <TodoList /> */}
        <TodoCards />
      </div>
  );
}
