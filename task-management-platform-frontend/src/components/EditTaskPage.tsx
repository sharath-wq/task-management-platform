import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Task } from "../interface";
import { getTask } from "../services/task-service";
import { TaskForm } from "../components/TaskForm";

export default function EditTaskPage() {
  const { id } = useParams<{ id: string }>();
  const [initialData, setInitialData] = useState<Task | null>(null);
  const token = localStorage.getItem("authToken") || "";

  useEffect(() => {
    async function fetchTask() {
      if (!id) return;
      try {
        const data = await getTask(id);
        setInitialData(data);
      } catch (error) {
        console.error("Failed to fetch task:", error);
      }
    }
    fetchTask();
  }, [id, token]);

  if (!initialData) return <p>Loading...</p>;
  if (!id) return <p>No task ID provided</p>;

  return (
    <TaskForm mode="edit" initialData={initialData} taskId={id} token={token} />
  );
}
