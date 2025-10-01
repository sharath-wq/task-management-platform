import api from "../api/axios";

interface Comment {
  content: string;
  userId?: string;
}

export const addComment = async (
  id: string,
  comment: Comment
): Promise<any> => {
  const res = await api.post(`/comments/${id}`, comment);
  return res.data;
};

export const updateComment = async (id: string, comment: Comment) => {
  const res = await api.put(`/comments/${id}`, comment);
  return res.data;
};

export const deleteComment = async (id: string) => {
  const res = await api.delete(`/comments/${id}`);
  return res.data;
};
