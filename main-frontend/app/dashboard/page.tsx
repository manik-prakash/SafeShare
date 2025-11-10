"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard-header"
import FileUpload from "@/components/file-upload"
import FileList from "@/components/file-list"
import Alert from "@/components/alert"

interface User {
  id: string
  username: string
  email: string
  role: string
}

interface File {
  _id: string
  filename: string
  size: number
  uploadedAt: string
  owner: { _id: string; username: string }
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")

    if (!token || !userData) {
      router.push("/auth/login")
      return
    }

    setUser(JSON.parse(userData))
    loadFiles(token)
  }, [router])

  const loadFiles = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/files/my-files`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.ok) {
        const data = await response.json()
        setFiles(data.files || [])
      } else {
        showAlert("Failed to load files", "error")
      }
    } catch (error) {
      console.log(error);
      showAlert("Network error", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const token = localStorage.getItem("token")
    if (!token) return

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/files/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })

      if (response.ok) {
        showAlert("File uploaded successfully!", "success")
        const token = localStorage.getItem("token")
        if (token) await loadFiles(token)
      } else {
        const data = await response.json()
        console.log(data);
        showAlert(data.error || "Upload failed", "error")
      }
    } catch (error) {
      console.log(error);
      showAlert("Network error", "error")
    }

    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleDownload = async (fileId: string, filename: string) => {
    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/files/download/${fileId}`,
        { headers: { Authorization: `Bearer ${token}` } },
      )

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        a.remove()
        showAlert("File downloaded!", "success")
      } else {
        showAlert("Download failed", "error")
      }
    } catch (error) {
      console.log(error);
      showAlert("Network error", "error")
    }
  }

  const handleShare = async (fileId: string) => {
    const email = prompt("Enter email address to share with:")
    if (!email) return

    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/files/share/${fileId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userEmail: email }),
        },
      )

      const data = await response.json()
      if (response.ok) {
        showAlert("File shared successfully!", "success")
      } else {
        showAlert(data.error || "Sharing failed", "error")
      }
    } catch (error) {
      console.log(error);
      showAlert("Network error", "error")
    }
  }

  const handleDelete = async (fileId: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return

    const token = localStorage.getItem("token")
    if (!token) return

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/files/delete/${fileId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        },
      )

      if (response.ok) {
        showAlert("File deleted!", "success")
        const token = localStorage.getItem("token")
        if (token) await loadFiles(token)
      } else {
        showAlert("Delete failed", "error")
      }
    } catch (error) {
      console.log(error);
      showAlert("Network error", "error")
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }



  const showAlert = (message: string, type: "success" | "error") => {
    setAlert({ message, type })
    setTimeout(() => setAlert(null), 5000)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader user={user} onLogout={handleLogout} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {alert && <Alert message={alert.message} type={alert.type} />}

        <div className="space-y-8">
          {/* Upload Section */}
          <FileUpload fileInputRef={fileInputRef} onFileSelect={handleFileSelect} />

          {/* Files List */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Your Files</h2>
            {files.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-lg bg-card">
                <p className="text-muted-foreground">No files uploaded yet. Upload your first file to get started!</p>
              </div>
            ) : (
              <FileList
                files={files}
                currentUserId={user?.id || ""}
                currentUserRole={user?.role || ""}
                onDownload={handleDownload}
                onShare={handleShare}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
