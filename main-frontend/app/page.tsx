"use client"
import Link from "next/link"
import { Lock, Shield, Key, Eye, CheckCircle2 } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background to-muted">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold text-foreground">SecureVault</span>
          </div>
          <div className="flex gap-3">
            <Link href="/auth/login">
              <button className="px-6 py-2 text-foreground hover:bg-muted transition-colors rounded-lg">Login</button>
            </Link>
            <Link href="/auth/register">
              <button className="px-6 py-2 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-lg font-medium">
                Get Started
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-8">
          <div>
            <h1 className="text-5xl sm:text-6xl font-bold text-balance mb-4">Secure File Management for Everyone</h1>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Store, encrypt, and share your files with military-grade security. Built for privacy-conscious users.
            </p>
          </div>

          <div className="flex gap-4 justify-center pt-4">
            <Link href="/auth/register">
              <button className="px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors rounded-lg font-medium">
                Create Free Account
              </button>
            </Link>
            <Link href="/auth/login">
              <button className="px-8 py-3 border border-border text-foreground hover:bg-muted transition-colors rounded-lg font-medium">
                Sign In
              </button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-20">
          <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors">
            <Shield className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">AES-256 Encryption</h3>
            <p className="text-muted-foreground">Military-grade encryption keeps your files secure</p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors">
            <Key className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">JWT Authentication</h3>
            <p className="text-muted-foreground">Secure token-based authentication system</p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors">
            <CheckCircle2 className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">Input Validation</h3>
            <p className="text-muted-foreground">Protection against XSS and injection attacks</p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors">
            <Shield className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">Rate Limiting</h3>
            <p className="text-muted-foreground">Prevent abuse with intelligent rate limiting</p>
          </div>

          <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors">
            <Lock className="w-10 h-10 text-primary mb-4" />
            <h3 className="font-semibold text-lg mb-2">File Sharing</h3>
            <p className="text-muted-foreground">Securely share files with granular permissions</p>
          </div>
        </div>
      </div>
    </div>
  )
}
