"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export default function DashboardPage() {
  const router = useRouter()
  const [error, setError] = useState("")

  useEffect(() => {
    const controller = new AbortController()

    async function findDashboard() {
      try {
        const response = await fetch(`${apiUrl}/api/me`, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        })

        if (response.status === 401) {
          router.replace("/sign-in")
          return
        }

        const result = await response.json()

        if (response.status === 403) {
          setError(result.message)
          return
        }

        if (!response.ok) {
          throw new Error()
        }

        const destination = result.user.role === "admin" ? "admin" : "customer"
        router.replace(`/dashboard/${destination}`)
      } catch {
        if (!controller.signal.aborted) {
          setError("Could not load your dashboard. Refresh to try again.")
        }
      }
    }

    findDashboard()
    return () => controller.abort()
  }, [router])

  return (
    <main className="studio-page">
      {error ? <p role="alert">{error}</p> : <p role="status">Opening your dashboard…</p>}
    </main>
  )
}