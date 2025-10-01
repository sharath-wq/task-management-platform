import api from "../api/axios";

export const getTaskOverview = async (): Promise<any> => {
  const res = await api.get(`/analytics/tasks/overview`);
  return res.data;
};

export const getUserPerformance = async (userId: string) => {
  const res = await api.get(`/analytics/users/performance?userId=${userId}`);
  return res.data;
};

export const getTaskTrends = async (
  from: string,
  to: string,
  interval: string
) => {
  const res = await api.get(
    `/analytics/tasks/trends?from=${from}&to=${to}&interval=${interval}`
  );
  return res.data;
};

export const exportTasks = async () => {
  const res = await api.get(`/analytics/tasks/export`, {
    responseType: "blob",
  });
  return res.data;
};
