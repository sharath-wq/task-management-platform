import { useEffect, useState } from "react";
import type { Filters, Task } from "../interface";
import { getTasks } from "../services/task-service";
import "./home.css";
import Header from "../components/Header";
import FilterComponent from "../components/Filters";
import TaskList from "../components/TaskList";
import Pagination from "../components/Pagination";

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [firstLoad, setFirstLoad] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    status: "all",
    priority: "all",
    search: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const json = await getTasks(
          pagination.page,
          pagination.limit,
          "due_date",
          "asc",
          filters
        );
        setTasks(json.data);
        setPagination((prev) => ({
          ...prev,
          totalPages: json.pagination.totalPages,
        }));
      } catch (err) {
        console.error("Failed to fetch tasks", err);
      } finally {
        setLoading(false);
        setFirstLoad(false);
      }
    };
    fetchTasks();
  }, [pagination.page, pagination.limit, filters]);

  const handleTaskAdd = () => {
    window.location.href = "/add";
  };

  if (firstLoad && loading) return <div className="loading">Loading...</div>;

  return (
    <div className="homepage">
      <Header onAddTask={handleTaskAdd} />
      <div className="content">
        <FilterComponent filters={filters} setFilters={setFilters} />
        <main className="main-content">
          <h2>All Tasks</h2>
          <TaskList tasks={tasks} />
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={(page) => setPagination({ ...pagination, page })}
          />
        </main>
      </div>

      {loading && !firstLoad && (
        <div className="overlay-loading">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}
