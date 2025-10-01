import { useDispatch } from "react-redux";
import { clearCredentials } from "../store/authSlice";

export default function Header({ onAddTask }: { onAddTask: () => void }) {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearCredentials());
    window.location.href = "/login";
  };

  const handleDashboardClick = () => {
    window.location.href = "/dashboard";
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1>Task Manager</h1>
        <p>Manage your tasks</p>
      </div>
      <div className="header-right">
        <button onClick={handleDashboardClick} className="go-to-dashboard-btn">
          Dashboard
        </button>
        <button onClick={onAddTask} className="add-task-btn">
          Add Task
        </button>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </header>
  );
}
