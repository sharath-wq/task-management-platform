import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/";

export const register = async (data: {
  email: string;
  password: string;
  name: string;
}) => {
  const response = await axios.post(`${API_URL}/auth/register`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const login = async (data: { email: string; password: string }) => {
  const response = await axios.post(`${API_URL}/auth/login`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};
