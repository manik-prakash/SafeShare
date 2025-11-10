"use client"

import type React from "react"

import { Upload } from "lucide-react"

interface FileUploadProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export default function FileUpload({ fileInputRef, onFileSelect }: FileUploadProps) {
  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      className="p-12 border-2 border-dashed border-primary/30 rounded-xl bg-primary/5 hover:bg-primary/10 hover:border-primary/50 transition-all cursor-pointer text-center"
    >
      <Upload className="w-12 h-12 text-primary mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">Click to Upload</h3>
      <p className="text-sm text-muted-foreground mb-2">or drag and drop</p>
      <p className="text-xs text-muted-foreground">Max file size: 10MB | Allowed: Images, PDF, Documents</p>
      <input ref={fileInputRef} type="file" onChange={onFileSelect} className="hidden" />
    </div>
  )
}
