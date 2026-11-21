"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export default function RoleDashboard({ role }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [overview, setOverview] = useState(null)
  const [error, setError] = useState("")
  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function loadDashboard() {
      try {
        const userResponse = await fetch(`${apiUrl}/api/me`, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        })

        if (userResponse.status === 401) {
          router.replace("/sign-in")
          return
        }

        const userResult = await userResponse.json()

        if (userResponse.status === 403) {
          setError(userResult.message)
          return
        }

        if (!userResponse.ok) {
          throw new Error()
        }

        if (userResult.user.role !== role) {
          router.replace(`/dashboard/${userResult.user.role}`)
          return
        }

        const overviewResponse = await fetch(`${apiUrl}/api/${role}/overview`, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        })

        if (!overviewResponse.ok) {
          throw new Error()
        }

        setUser(userResult.user)
        setOverview(await overviewResponse.json())
      } catch {
        if (!controller.signal.aborted) {
          setError("Could not load your dashboard. Refresh to try again.")
        }
      }
    }

    loadDashboard()
    return () => controller.abort()
  }, [role, router])

  async function signOut() {
    setSigningOut(true)

    try {
      const response = await fetch(`${apiUrl}/api/auth/sign-out`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      })

      if (!response.ok) {
        throw new Error()
      }

      window.dispatchEvent(new Event("salonbook-auth-changed"))

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

  if (!user || !overview) {
    return (
      <main className="studio-page">
        <p role="status">Loading your dashboard…</p>
      </main>
    )
  }

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar">
        <Link className="wordmark" href="/">SalonBook</Link>
        <p>{role === "admin" ? "Admin dashboard" : "Customer dashboard"}</p>

        <nav aria-label="Dashboard navigation">
          <Link href={`/dashboard/${role}`} aria-current="page">
            Overview
          </Link>

          {role === "customer" && (
            <Link href="/dashboard/customer/appointments">My appointments</Link>
          )}

          {role === "admin" && (
            <>
              <Link href="/dashboard/admin/services">Manage services</Link>
              <Link href="/dashboard/admin/appointments">Manage appointments</Link>
              <Link href="/dashboard/admin/users">Manage customers</Link>
            </>
          )}
        </nav>

        <button type="button" onClick={signOut} disabled={signingOut}>
          {signingOut ? "Signing out…" : "Sign out"}
        </button>
      </aside>

      <main className="dashboard-content">
        <p className="dashboard-eyebrow">
          {role === "admin" ? "Salon management" : "Your salon visits"}
        </p>
        <h1>Welcome, {user.name}</h1>
        <p>{user.email}</p>

        <div className="dashboard-stats">
          {role === "admin" ? (
            <>
              <div className="dashboard-stat">
                <span>Registered customers</span>
                <strong>{overview.totalCustomers}</strong>
              </div>

              <div className="dashboard-stat">
                <span>Active services</span>
                <strong>{overview.totalActiveServices}</strong>
              </div>

              <div className="dashboard-stat">
                <span>Total requests</span>
                <strong>{overview.totalAppointments}</strong>
              </div>

              <div className="dashboard-stat">
                <span>Pending</span>
                <strong>{overview.pendingAppointments}</strong>
              </div>

              <div className="dashboard-stat">
                <span>Confirmed</span>
                <strong>{overview.confirmedAppointments}</strong>
              </div>

              <div className="dashboard-stat">
                <span>Successful payments</span>
                <strong>{overview.totalSuccessfulPayments}</strong>
              </div>
            </>
          ) : (
            <>
              <div className="dashboard-stat">
                <span>Total requests</span>
                <strong>{overview.totalAppointments}</strong>
              </div>

              <div className="dashboard-stat">
                <span>Pending</span>
                <strong>{overview.pendingAppointments}</strong>
              </div>

              <div className="dashboard-stat">
                <span>Confirmed</span>
                <strong>{overview.confirmedAppointments}</strong>
              </div>

              <div className="dashboard-stat">
                <span>Cancelled</span>
                <strong>{overview.cancelledAppointments}</strong>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  )
}