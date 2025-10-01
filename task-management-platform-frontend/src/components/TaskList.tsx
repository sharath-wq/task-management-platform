import type { Task } from "../interface";
import TaskCard from "./TaskCard";

interface Props {
  tasks: Task[];
}

export default function TaskList({ tasks }: Props) {
  if (tasks.length === 0) return <p>No tasks found</p>;

  return (
    <div className="tasks-grid">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} />
      ))}
    </div>
  );
}
