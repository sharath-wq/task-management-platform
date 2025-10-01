import type { Task } from "../interface";

interface Props {
  task: Task;
}

export default function TaskCard({ task }: Props) {
  const handleClick = () => {
    window.location.href = `/task/${task._id}`;
  };

  return (
    <div onClick={handleClick} className="task-card">
      <h3>{task.title}</h3>
      <p>{task.description}</p>
      <p>
        <strong>Status:</strong> {task.status} | <strong>Priority:</strong>{" "}
        {task.priority}
      </p>
      <p>
        <strong>Due:</strong>{" "}
        {task.due_date ? new Date(task.due_date).toLocaleDateString() : "N/A"}
      </p>
      <p>
        <strong>Tags:</strong> {task.tags?.join(", ") || "None"}
      </p>
    </div>
  );
}
