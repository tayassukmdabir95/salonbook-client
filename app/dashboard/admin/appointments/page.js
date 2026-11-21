"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

const apiUrl = process.env.NEXT_PUBLIC_API_URL

function formatDate(value) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function ManageAppointmentsPage() {
  const router = useRouter()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState("")

  async function loadAppointments() {
    const response = await fetch(`${apiUrl}/api/admin/appointments`, {
      credentials: "include",
      cache: "no-store",
    })

    if (response.status === 401) {
      router.replace("/sign-in")
      return
    }

    if (response.status === 403) {
      router.replace("/dashboard")
      return
    }

    if (!response.ok) throw new Error("Could not load appointments.")

    const result = await response.json()
    setAppointments(result.appointments)
    setLoading(false)
  }

  useEffect(() => {
    loadAppointments().catch((loadError) => {
      setError(loadError.message)
      setLoading(false)
    })
  }, [])

  async function changeStatus(appointment, action) {
    if (
      !window.confirm(
        `${action === "confirm" ? "Confirm" : "Cancel"} this appointment?`,
      )
    ) {
      return
    }

    setBusyId(appointment._id)

    try {
      const response = await fetch(
        `${apiUrl}/api/admin/appointments/${appointment._id}/${action}`,
        {
          method: "PATCH",
          credentials: "include",
        },
      )

      const result = await response.json()

      if (!response.ok) throw new Error(result.message)

      toast.success(result.message)
      await loadAppointments()
    } catch (actionError) {
      toast.error(actionError.message || "Could not update the appointment.")
    } finally {
      setBusyId(null)
    }
  }

  return (
    <main className="admin-table-page">
      <Link href="/dashboard/admin">← Admin overview</Link>
      <p className="eyebrow">Salon schedule</p>
      <h1>Manage appointments</h1>

      {loading && <p role="status">Loading appointments…</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && appointments.length === 0 && (
        <p>No appointment requests yet.</p>
      )}

      <div className="admin-record-list">
        {appointments.map((appointment) => (
          <article className="admin-record" key={appointment._id}>
            <div className="admin-record-heading">
              <div>
                <p className="eyebrow">
                  {appointment.service?.category || "Salon service"}
                </p>
                <h2>
                  {appointment.service?.serviceName || "Service unavailable"}
                </h2>
              </div>
              <span className={`appointment-status status-${appointment.status}`}>
                {appointment.status}
              </span>
            </div>

            <div className="admin-record-facts">
              <p><strong>Customer</strong> {appointment.customer?.name || "Unknown"}</p>
              <p><strong>Email</strong> {appointment.customer?.email || "—"}</p>
              <p><strong>Date</strong> {appointment.appointmentDate}</p>
              <p><strong>Time</strong> {appointment.timeSlot}</p>
              <p><strong>Price</strong> ${Number(appointment.servicePrice).toFixed(2)}</p>
              <p><strong>Payment</strong> {appointment.paymentStatus}</p>
              <p><strong>Requested</strong> {formatDate(appointment.createdAt)}</p>
              <p><strong>Message</strong> {appointment.message || "None"}</p>
            </div>

            <div className="appointment-actions">
              {appointment.status === "pending" && (
                <button
                  type="button"
                  disabled={busyId === appointment._id}
                  onClick={() => changeStatus(appointment, "confirm")}
                >
                  Confirm
                </button>
              )}
              {appointment.status !== "cancelled" && (
                <button
                  type="button"
                  disabled={busyId === appointment._id}
                  onClick={() => changeStatus(appointment, "cancel")}
                >
                  Cancel
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}