"use client"

import Link from "next/link"
import { LogOut, Lock } from "lucide-react"

interface User {
  username: string
  email: string
  role: string
}

interface DashboardHeaderProps {
  user: User | null
  onLogout: () => void
}

export default function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Lock className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">SafeShare</span>
          </Link>

          <div className="flex items-center gap-6">
            {user && (
              <div className="text-right">
                <p className="font-medium text-foreground">{user.username}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            )}
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-foreground hover:bg-muted transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
