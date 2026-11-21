"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"
import RoleDashboard from "../../../components/RoleDashboard"

export default function RoleDashboardPage() {
  const { role } = useParams()
  const router = useRouter()
  const validRole = role === "admin" || role === "customer"

  useEffect(() => {
    if (!validRole) {
      router.replace("/dashboard")
    }
  }, [validRole, router])

  if (!validRole) {
    return (
      <main className="studio-page">
        <p role="status">Opening your dashboard…</p>
      </main>
    )
  }

  return <RoleDashboard role={role} />
}