"use client"

import { AlertCircle, CheckCircle2 } from "lucide-react"

interface AlertProps {
  message: string
  type: "success" | "error"
}

export default function Alert({ message, type }: AlertProps) {
  const isSuccess = type === "success"

  return (
    <div
      className={`flex gap-3 p-4 rounded-lg border ${
        isSuccess ? "bg-success/10 border-success/20" : "bg-destructive/10 border-destructive/20"
      }`}
    >
      {isSuccess ? (
        <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
      ) : (
        <AlertCircle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
      )}
      <p className={`text-sm ${isSuccess ? "text-success" : "text-destructive"}`}>{message}</p>
    </div>
  )
}
