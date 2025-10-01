import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTask } from "../services/task-service";
import type { FileItem, Task } from "../interface";
import TaskDetails from "../components/TaskDetails";
import Comments from "../components/Comments";
import Attachments from "../components/Attachments";
import "./taskview.css";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

export default function TaskView() {
  const [task, setTask] = useState<Task | null>(null);
  const { id } = useParams<{ id: string }>();
  const user = useSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    async function fetchTask() {
      if (!id) return;
      try {
        const data = await getTask(id);
        setTask(data);
      } catch (error) {
        console.error("Failed to fetch task:", error);
      }
    }
    fetchTask();
  }, [id]);

  const setTaskFiles = (updater: (prevFiles: FileItem[]) => FileItem[]) => {
    setTask((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        files: updater(prev.files || []),
      };
    });
  };

  if (!task) return <div className="text-muted">Loading Task...</div>;

  return (
    <div className="container">
      <TaskDetails task={task} />
      <Comments
        userId={user?.id!}
        taskId={task._id!}
        comments={task.comments || []}
      />
      <Attachments
        taskId={task._id!}
        files={task.files || []}
        onFilesChange={setTaskFiles}
      />
    </div>
  );
}
