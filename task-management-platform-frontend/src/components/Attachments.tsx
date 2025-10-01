import React, { useRef, useState, useEffect } from "react";
import { deleteFile, uploadFile } from "../services/file-service";

type FileItem = {
  _id: string;
  task: string;
  uploaded_by: string;
  filename: string;
  file_url: string;
  mimetype: string;
  size: number;
  is_deleted: boolean;
  created_at?: string;
  updatedAt?: string;
  local?: boolean;
  tempId?: string;
  tempBlobUrl?: string;
};

function formatBytes(bytes?: number) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

type Props = {
  taskId: string;
  files: FileItem[];
  onFilesChange: (updater: (prevFiles: FileItem[]) => FileItem[]) => void;
};

export default function Attachments({ taskId, files, onFilesChange }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const blobUrlsRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    return () => {
      blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
      blobUrlsRef.current.clear();
    };
  }, []);

  const onPick = () => inputRef.current?.click();

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    if (!selectedFiles.length) return;

    setUploading(true);

    try {
      const tempFiles: FileItem[] = selectedFiles.map((file) => {
        const blobUrl = URL.createObjectURL(file);
        const tempId = `temp-${Date.now()}-${Math.random()}`;
        blobUrlsRef.current.set(tempId, blobUrl);

        return {
          _id: "",
          tempId,
          task: taskId,
          uploaded_by: "",
          filename: file.name,
          file_url: "",
          tempBlobUrl: blobUrl,
          mimetype: file.type || "unknown",
          size: file.size,
          is_deleted: false,
          local: true,
        };
      });

      onFilesChange((prev) => [...prev, ...tempFiles]);

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const tempFile = tempFiles[i];

        try {
          const res = await uploadFile(taskId, file);

          onFilesChange((prev) =>
            prev.map((f) => {
              if (f.tempId === tempFile.tempId) {
                const updatedFile = {
                  ...f,
                  ...res,

                  _id: res._id || res.id || "",
                  filename: res.filename || f.filename,
                  mimetype: res.mimetype || f.mimetype,
                  size: res.size || f.size,
                  file_url: res.file_url || "",
                  local: false,
                  tempBlobUrl: f.tempBlobUrl,
                };
                console.log("Updated file after upload:", updatedFile);
                return updatedFile;
              }
              return f;
            })
          );
        } catch (err) {
          console.error(`Failed to upload ${file.name}:`, err);
          const blobUrl = blobUrlsRef.current.get(tempFile.tempId!);
          if (blobUrl) {
            URL.revokeObjectURL(blobUrl);
            blobUrlsRef.current.delete(tempFile.tempId!);
          }
          onFilesChange((prev) =>
            prev.filter((f) => f.tempId !== tempFile.tempId)
          );
        }
      }
    } catch (err: any) {
      console.error("Upload failed:", err);
      alert("File upload failed" + err?.message || "");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleDelete = async (file: FileItem) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this file?"
    );
    if (!confirmed) return;

    try {
      if (!file.local && file._id) {
        await deleteFile(file._id);
      }

      if (file.tempId && blobUrlsRef.current.has(file.tempId)) {
        const blobUrl = blobUrlsRef.current.get(file.tempId);
        if (blobUrl) {
          URL.revokeObjectURL(blobUrl);
          blobUrlsRef.current.delete(file.tempId);
        }
      }

      onFilesChange((prev) =>
        prev.filter((f) => {
          if (file._id && f._id && f._id === file._id) return false;
          if (file.tempId && f.tempId && f.tempId === file.tempId) return false;
          return true;
        })
      );
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete the file. Please try again.");
    }
  };

  const getDisplayUrl = (file: FileItem) => {
    if (file.tempBlobUrl) {
      return file.tempBlobUrl;
    }

    if (file.file_url) {
      if (file.file_url.startsWith("http")) {
        return file.file_url;
      }
      return `http://localhost:3000/uploads/${file.file_url}`;
    }

    return "";
  };

  return (
    <section className="space-y-4">
      <h2>Attachments</h2>
      <div className="flex-between">
        <div className="text-muted">Upload files to share with the task.</div>
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="file"
            style={{ display: "none" }}
            multiple
            onChange={onChange}
          />
          <button className="button" onClick={onPick} disabled={uploading}>
            {uploading ? "Uploading..." : "Upload Files"}
          </button>
        </div>
      </div>
      <ul className="list">
        {files.length === 0 ? (
          <li className="text-muted">No files yet.</li>
        ) : (
          files.map((f) => (
            <li key={f._id || f.tempId} className="comment-item">
              <div className="comment-content">
                <div className="comment-text">{f.filename || "unknown"}</div>
                <div className="comment-meta">
                  {f.mimetype || "unknown"} · {formatBytes(f.size)}{" "}
                  {f.local ? "· (uploading)" : ""}
                </div>
              </div>
              <div className="comment-actions flex flex-col gap-1">
                {/* Preview image */}
                {f.mimetype?.startsWith("image/") && (
                  <img
                    className="preview-thumb"
                    src={getDisplayUrl(f)}
                    alt={f.filename || "Image preview"}
                    onError={(e) => {
                      console.error("Image failed to load:", getDisplayUrl(f));
                      e.currentTarget.style.display = "none";
                    }}
                  />
                )}

                {/* PDF preview */}
                {f.mimetype === "application/pdf" && f.file_url && !f.local && (
                  <a
                    className="button ghost"
                    href={`http://localhost:3000/uploads/${f.file_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View PDF
                  </a>
                )}

                <div className="button-stack">
                  {f._id && (
                    <a
                      className="button secondary"
                      href={`http://localhost:3000/api/v1/files/${
                        f._id || (f as any).id
                      }`}
                      download
                    >
                      Download
                    </a>
                  )}
                  <button
                    className="button ghost"
                    onClick={() => handleDelete(f)}
                    style={{ height: "30px", textAlign: "center" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))
        )}
      </ul>
    </section>
  );
}
