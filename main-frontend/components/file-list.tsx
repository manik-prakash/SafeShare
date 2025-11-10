"use client"

import { Download, Share2, Trash2 } from "lucide-react"

interface File {
  _id: string
  filename: string
  size: number
  uploadedAt: string
  owner: { _id: string; username: string }
}

interface FileListProps {
  files: File[]
  currentUserId: string
  currentUserRole: string
  onDownload: (fileId: string, filename: string) => void
  onShare: (fileId: string) => void
  onDelete: (fileId: string) => void
}

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const sizes = ["Bytes", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
}

export default function FileList({
  files,
  currentUserId,
  currentUserRole,
  onDownload,
  onShare,
  onDelete,
}: FileListProps) {
  return (
    <div className="space-y-3">
      {files.map((file) => (
        <div
          key={file._id}
          className="flex items-center justify-between p-4 rounded-lg border border-border bg-card hover:border-primary/30 transition-all"
        >
          <div className="flex-1">
            <h3 className="font-medium text-foreground">{file.filename}</h3>
            <p className="text-sm text-muted-foreground">
              {formatBytes(file.size)} • {new Date(file.uploadedAt).toLocaleDateString()} • owner : {file.owner.username}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onDownload(file._id, file.filename)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <Download className="w-4 h-4" />
              Download
            </button>

            <button
              onClick={() => onShare(file._id)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors text-sm font-medium"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>

            {(file.owner._id === currentUserId || currentUserRole === "admin") && (
              <button
                onClick={() => onDelete(file._id)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-destructive text-destructive hover:bg-destructive/10 transition-colors text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
