"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

const authUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth`

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [error, setError] = useState("")
  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function loadSession() {
      try {
        const response = await fetch(`${authUrl}/get-session`, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        })

        if (!response.ok) throw new Error()

        const session = await response.json()

        if (!session?.user) {
          router.replace("/sign-in")
          return
        }

        setUser(session.user)
      } catch {
        if (!controller.signal.aborted) {
          setError("Could not load your session. Refresh to try again.")
        }
      }
    }

    loadSession()
    return () => controller.abort()
  }, [router])

  async function signOut() {
    setSigningOut(true)

    try {
      const response = await fetch(`${authUrl}/sign-out`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })

      if (!response.ok) throw new Error()

      toast.success("You have signed out.")
      router.replace("/sign-in")
    } catch {
      toast.error("Sign-out failed. Please try again.")
      setSigningOut(false)
    }
  }

  if (error) {
    return (
      <main className="studio-page">
        <p role="alert">{error}</p>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="studio-page">
        <p role="status">Loading your session…</p>
      </main>
    )
  }

  return (
    <main className="studio-page">
      <h1>Dashboard</h1>
      <p>Welcome, {user.name}.</p>
      <p>Signed in as {user.email}</p>
      <button
        className="primary-action"
        type="button"
        onClick={signOut}
        disabled={signingOut}
      >
        {signingOut ? "Signing out…" : "Sign out"}
      </button>
    </main>
  )
}