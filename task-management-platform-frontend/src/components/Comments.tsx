import { useState } from "react";
import {
  addComment,
  deleteComment,
  updateComment,
} from "../services/comment-service";

type CommentItem = {
  _id: string;
  task: string;
  user?: {
    _id: string;
    name: string;
  };
  content: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  __v: number;
};

type Props = {
  userId: string;
  taskId: string;
  comments: CommentItem[];
};

export default function Comments({ userId, taskId, comments }: Props) {
  const [newContent, setNewContent] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [allComments, setAllComments] = useState<CommentItem[] | null>(
    comments
  );

  const submitNew = async () => {
    if (!newContent.trim()) return;
    const newCommend = await addComment(taskId, {
      content: newContent.trim(),
      userId: userId,
    });
    setAllComments([newCommend, ...(allComments || [])]);
    setNewContent("");
  };

  const startEdit = (id: string, content: string) => {
    setEditingId(id);
    setEditingContent(content);
  };

  const saveEdit = async (id: string) => {
    if (!editingId || !editingContent.trim()) return;
    const updated = await updateComment(id, { content: editingContent.trim() });
    const updatedComments = (allComments || []).map((c) =>
      c._id === id ? updated : c
    );
    setAllComments(updatedComments);
    setEditingId(null);
    setEditingContent("");
  };

  const handleDelete = (id: string) => {
    if (!id) return;
    const updated = (allComments || []).filter((c) => c._id !== id);
    setAllComments(updated);
    deleteComment(id);
  };

  return (
    <section className="space-y-4">
      <h2>Comments</h2>

      <ul className="space-y-4">
        {allComments &&
          allComments.map((c) => {
            const isEditing = editingId === c._id;
            return (
              <li key={c._id} className="card">
                <div className="flex-between">
                  <div className="text-muted">
                    <strong>{c?.user?.name}</strong> ·{" "}
                    {new Date(c.created_at).toLocaleString()}
                  </div>
                  <div className="button-box">
                    {!isEditing && (
                      <button
                        className="button secondary"
                        onClick={() => startEdit(c._id, c.content)}
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="button secondary"
                      onClick={() => handleDelete(c._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {!isEditing ? (
                  <p>{c.content}</p>
                ) : (
                  <div className="space-y-2">
                    <textarea
                      className="textarea"
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        className="button ghost"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                      <button
                        className="button"
                        onClick={() => saveEdit(c._id)}
                        disabled={!editingContent.trim()}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
      </ul>

      <div className="space-y-2">
        <textarea
          className="textarea"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Write a comment..."
        />
        <div className="flex justify-end">
          <button
            className="button secondary"
            onClick={submitNew}
            disabled={!newContent.trim()}
          >
            Add Comment
          </button>
        </div>
      </div>
    </section>
  );
}
