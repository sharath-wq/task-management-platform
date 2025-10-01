import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./dashboard.css";
import {
  getTaskOverview,
  getTaskTrends,
  getUserPerformance,
  exportTasks,
} from "../services/analytics-service";
import { useSelector } from "react-redux";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TaskTrends {
  _id: string;
  count: number;
}
interface StatusStat {
  _id: string;
  count: number;
}
interface PriorityStat {
  _id: string;
  count: number;
}

export default function Dashboard() {
  const [_currentTasks, setCurrentTasks] = useState({
    totalTasks: 0,
    completed: 0,
    pending: 0,
  });
  const [taskTrends, setTaskTrends] = useState<TaskTrends[]>([]);
  const [statusStats, setStatusStats] = useState<StatusStat[]>([]);
  const [priorityStats, setPriorityStats] = useState<PriorityStat[]>([]);
  const [userPerformance, setUserPerformance] = useState({
    totalTasks: 0,
    completed: 0,
    pending: 0,
  });
  const [loading, setLoading] = useState(true);

  const user = useSelector((state: any) => state.auth.user);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 1. Fetch overall overview
        const overview = await getTaskOverview();
        setCurrentTasks({
          totalTasks: overview.totalTasks,
          completed: overview.completed,
          pending: overview.pending,
        });
        if (overview.statusStats) setStatusStats(overview.statusStats);
        if (overview.priorityStats) setPriorityStats(overview.priorityStats);

        const today = new Date();
        const from = new Date(today);
        today.setDate(today.getDate() + 1);
        from.setDate(today.getDate() - 6);
        const formatDate = (d: Date) => d.toISOString().split("T")[0];

        const trends = await getTaskTrends(
          formatDate(from),
          formatDate(today),
          "day"
        );
        setTaskTrends(trends);

        const performance = await getUserPerformance(user.id);
        setUserPerformance(performance);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleExport = async () => {
    try {
      const blob = await exportTasks();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tasks-report.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };
  const barData = {
    labels: taskTrends.map((t) => t._id),
    datasets: [
      {
        label: "Tasks",
        data: taskTrends.map((t) => t.count),
        backgroundColor: "#007bff",
        borderRadius: 4,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true, ticks: { stepSize: 5 } },
    },
  };

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div className="dashboard">
      <h1>Task Dashboard</h1>

      {/* User Performance */}
      <section className="current-tasks">
        <h2>Your Performance</h2>
        <div className="task-cards">
          <div className="card">
            <h3>Total Tasks</h3>
            <p>{userPerformance.totalTasks}</p>
          </div>
          <div className="card">
            <h3>Completed</h3>
            <p>{userPerformance.completed}</p>
          </div>
          <div className="card">
            <h3>Pending</h3>
            <p>{userPerformance.pending}</p>
          </div>
        </div>
      </section>

      {/* Task Trends */}
      <section className="task-trends">
        <h2>Task Trends</h2>
        <Bar data={barData} options={barOptions} />
      </section>

      {/* Status & Priority */}
      <section className="status-priority">
        <div className="status">
          <h2>Status Stats</h2>
          <ul>
            {statusStats.map((s) => (
              <li key={s._id}>
                {s._id}: {s.count}
              </li>
            ))}
          </ul>
        </div>
        <div className="priority">
          <h2>Priority Stats</h2>
          <ul>
            {priorityStats.map((p) => (
              <li key={p._id}>
                {p._id}: {p.count}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="export-report">
        <button onClick={handleExport}>Export Report</button>
      </section>
    </div>
  );
}
