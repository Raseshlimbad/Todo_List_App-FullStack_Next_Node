import TodoDetails from "@/components/TodoDetails";

interface TodoDetailPageProps {
  params: { id: string }; // Next.js provides `params` with dynamic `id`
}

export default function TodoDetailPage({ params }: TodoDetailPageProps) {
  const { id } = params; // Directly destructure params

  console.log("Server params:", params);

  return (
    <div className="mx-40 mt-20">

      {/* component calls passing props */}
      <TodoDetails todoId={id} />
    </div>
  );
}
