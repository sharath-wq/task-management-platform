import { deleteTask } from "../services/task-service";

type Props = {
  task: {
    _id?: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    due_date: string;
    tags: string[];
    assigned_to: {
      _id: string;
      name: string;
    };
    created_at: string;
    updated_at: string;
  };
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  } catch {
    return iso;
  }
}

const handleEdit = async (taskId?: string) => {
  window.location.href = `/edit/${taskId}`;
};

const handleDelete = async (taskId?: string) => {
  if (taskId && window.confirm("Are you sure you want to delete this task?")) {
    await deleteTask(taskId);
    window.location.href = `/`;
  }
};

export default function TaskDetails({ task }: Props) {
  return (
    <section className="space-y-4">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        className="flex justify-between items-center"
      >
        <h2>Task Details</h2>
        <div className="flex gap-2">
          <button className="btn btn-edit" onClick={() => handleEdit(task._id)}>
            Edit
          </button>
          <button
            className="btn btn-delete"
            onClick={() => handleDelete(task._id)}
          >
            Delete
          </button>
        </div>
      </div>

      <div className="flex gap-2">
        <span className={`status-pill`}>Status: {task.status}</span>
        <span className={`priority-pill`}>Priority: {task.priority}</span>
        <div className="text-muted">Due {formatDate(task.due_date)}</div>
      </div>

      <h3>{task.title}</h3>
      <p className="text-muted">{task.description}</p>

      {task.tags?.length > 0 && (
        <div className="flex gap-2">
          {task.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex-between">
        <div>
          <strong>Assigned To:</strong> {task.assigned_to?.name}
        </div>
        <div>
          <strong>Task ID:</strong> {task._id}
        </div>
      </div>

      <div className="flex-between">
        <div>
          <strong>Created:</strong> {formatDate(task.created_at)}
        </div>
        <div>
          <strong>Updated:</strong> {formatDate(task.updated_at)}
        </div>
      </div>
    </section>
  );
}
