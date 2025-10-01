export interface Task {
  assigned_to: {
    _id: string;
    name: string;
  };
  files: FileItem[];
  comments: CommentItem[];
  updated_at: string;
  created_at: string;
  is_deleted: boolean;
  _id?: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  priority: "low" | "medium" | "high";
  due_date: string;
  tags: string[];
}

export interface Filters {
  status: string;
  priority: string;
  search: string;
}

export type CommentItem = {
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

export type FileItem = {
  _id: string;
  task: string;
  uploaded_by: string;
  filename: string;
  file_url: string;
  mimetype: string;
  size: number;
  is_deleted: boolean;
  created_at?: string;
  updated_at?: string;
  local?: boolean;
};
