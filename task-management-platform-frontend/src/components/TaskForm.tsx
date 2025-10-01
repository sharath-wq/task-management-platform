import React, {
  useState,
  useEffect,
  type FormEvent,
  type KeyboardEvent,
} from "react";
import "./css/taskform.css";
import type { Task } from "../interface";
import { createTask, updateTask } from "../services/task-service";
import { getUsers } from "../services/user-service";

interface User {
  _id: string;
  name: string;
  email: string;
}

interface TaskFormProps {
  mode: "create" | "edit";
  initialData?: Task;
  taskId?: string;
  token: string;
}

const formatDateForInput = (isoDate?: string) => {
  if (!isoDate) return "";
  return isoDate.split("T")[0];
};

export const TaskForm: React.FC<TaskFormProps> = ({
  mode,
  initialData,
  taskId,
  token,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState<Task>({
    _id: initialData?._id || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    status: initialData?.status || "todo",
    priority: initialData?.priority || "medium",
    due_date: formatDateForInput(initialData?.due_date),
    tags: initialData?.tags || [],
    assigned_to:
      typeof initialData?.assigned_to === "object" &&
      initialData?.assigned_to !== null
        ? initialData.assigned_to
        : { _id: "", name: "" },
    files: initialData?.files || [],
    comments: initialData?.comments || [],
    updated_at: initialData?.updated_at || "",
    created_at: initialData?.created_at || "",
    is_deleted: initialData?.is_deleted || false,
  });

  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await getUsers();
        setUsers(users);
      } catch (error: any) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, [token]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) newErrors.title = "Title is required";
    else if (formData.title.trim().length < 3)
      newErrors.title = "Title must be at least 3 characters";

    if (!formData.description.trim())
      newErrors.description = "Description is required";
    else if (formData.description.trim().length < 10)
      newErrors.description = "Description must be at least 10 characters";

    if (!formData.due_date) newErrors.due_date = "Due date is required";
    else if (new Date(formData.due_date) < new Date())
      newErrors.due_date = "Due date cannot be in the past";

    if (!formData.assigned_to?._id)
      newErrors.assigned_to = "Please assign the task to a user";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (mode === "create") {
        const { _id, ...taskData } = formData;
        await createTask({ ...taskData });
        alert("Task created successfully");
      } else if (mode === "edit" && taskId) {
        await updateTask(taskId, formData);
        alert("Task updated successfully");
      }
      window.location.href = "/";
    } catch (error: any) {
      alert(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddTag = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  return (
    <div className="page">
      <div className="form-container">
        <h2>{mode === "create" ? "Create New Task" : "Edit Task"}</h2>
        <form onSubmit={handleSubmit}>
          {/* Title */}
          <label>
            Title *
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            {errors.title && <span className="error">{errors.title}</span>}
          </label>

          {/* Description */}
          <label>
            Description *
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            {errors.description && (
              <span className="error">{errors.description}</span>
            )}
          </label>

          {/* Status */}
          <label>
            Status *
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as Task["status"],
                })
              }
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </label>

          {/* Priority */}
          <label>
            Priority *
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  priority: e.target.value as Task["priority"],
                })
              }
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          {/* Due Date */}
          <label>
            Due Date *
            <input
              type="date"
              value={formData.due_date}
              onChange={(e) =>
                setFormData({ ...formData, due_date: e.target.value })
              }
            />
            {errors.due_date && (
              <span className="error">{errors.due_date}</span>
            )}
          </label>

          {/* Assigned To */}
          <label>
            Assigned To *
            <select
              value={formData.assigned_to?._id || ""}
              onChange={(e) => {
                const selectedUser = users.find(
                  (user) => user._id === e.target.value
                );
                setFormData({
                  ...formData,
                  assigned_to: selectedUser
                    ? { _id: selectedUser._id, name: selectedUser.name }
                    : { _id: "", name: "" },
                });
              }}
            >
              <option value="">Select a user</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name}
                </option>
              ))}
            </select>
            {errors.assigned_to && (
              <span className="error">{errors.assigned_to}</span>
            )}
          </label>

          {/* Tags */}
          <label>
            Tags
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type a tag and press Enter"
            />
          </label>
          <div className="tags">
            {formData.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)}>
                  ×
                </button>
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="actions">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? mode === "create"
                  ? "Creating..."
                  : "Updating..."
                : mode === "create"
                ? "Create Task"
                : "Update Task"}
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
