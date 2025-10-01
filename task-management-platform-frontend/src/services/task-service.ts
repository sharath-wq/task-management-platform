import api from "../api/axios";
import type { Task } from "../interface";

export const getTasks = async (
  page: number,
  limit: number,
  sortBy = "due_date",
  sortOrder = "asc",
  filters?: { status?: string; priority?: string; search?: string }
) => {
  const params: any = { page, limit, sortBy, sortOrder };

  if (filters?.status && filters.status !== "all")
    params.status = filters.status;
  if (filters?.priority && filters.priority !== "all")
    params.priority = filters.priority;
  if (filters?.search) params.search = filters.search;

  const res = await api.get(`/tasks`, { params });
  return res.data;
};

export const getTask = async (id: string): Promise<Task> => {
  const res = await api.get(`/tasks/${id}`);
  return res.data;
};

export const createTask = async (task: Task) => {
  const res = await api.post("/tasks", task);
  return res.data;
};

export const updateTask = async (id: string, task: Task) => {
  const res = await api.put(`/tasks/${id}`, task);
  return res.data;
};

export const deleteTask = async (id: string) => {
  const res = await api.delete(`/tasks/${id}`);
  return res.data;
};
