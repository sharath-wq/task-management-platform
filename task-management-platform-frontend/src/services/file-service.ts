import api from "../api/axios";

export const uploadFile = async (taskId: string, file: File): Promise<any> => {
  const formData = new FormData();
  formData.append("files", file);

  const res = await api.post(`/files/${taskId}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const deleteFile = async (fileId: string): Promise<any> => {
  const res = await api.delete(`/files/${fileId}`);
  return res.data;
};
