"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

const apiUrl = process.env.NEXT_PUBLIC_API_URL

function formatDate(value) {
  if (!value) return "—"
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

export default function MyAppointmentsPage() {
  const router = useRouter()
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [cancellingId, setCancellingId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)

  async function loadAppointments() {
    const response = await fetch(`${apiUrl}/api/customer/appointments`, {
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

    if (!response.ok) {
      throw new Error("Could not load your appointments.")
    }

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

  async function cancelAppointment(appointment) {
    if (
      !window.confirm(
        `Cancel your ${appointment.service?.serviceName || "salon"} appointment?`,
      )
    ) {
      return
    }

    setCancellingId(appointment._id)

    try {
      const response = await fetch(
        `${apiUrl}/api/customer/appointments/${appointment._id}/cancel`,
        {
          method: "PATCH",
          credentials: "include",
        },
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message)
      }

      toast.success("Appointment cancelled.")
      await loadAppointments()
    } catch (cancelError) {
      toast.error(cancelError.message || "Could not cancel the appointment.")
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <main className="appointments-page">
      <Link href="/dashboard/customer">← Customer overview</Link>
      <div className="appointments-heading">
        <div>
          <p className="eyebrow">Your salon visits</p>
          <h1>My appointments</h1>
        </div>
        <Link className="primary-action" href="/services">
          Browse services
        </Link>
      </div>

      {loading && <p role="status">Loading your appointments…</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && appointments.length === 0 && (
        <p>You have no appointment requests yet.</p>
      )}

      <div className="appointment-list">
        {appointments.map((appointment) => {
          const service = appointment.service
          const expanded = expandedId === appointment._id

          return (
            <article className="appointment-card" key={appointment._id}>
              {service?.image && (
                <img src={service.image} alt="" />
              )}

              <div className="appointment-card-content">
                <div className="appointment-card-title">
                  <div>
                    <p className="eyebrow">{service?.category || "Salon service"}</p>
                    <h2>{service?.serviceName || "Service unavailable"}</h2>
                  </div>
                  <span className={`appointment-status status-${appointment.status}`}>
                    {appointment.status}
                  </span>
                </div>

                <div className="appointment-facts">
                  <span>Date: {appointment.appointmentDate}</span>
                  <span>Time: {appointment.timeSlot}</span>
                  <span>Price: ${Number(appointment.servicePrice).toFixed(2)}</span>
                  <span>Payment: {appointment.paymentStatus}</span>
                </div>

                <div className="appointment-actions">
                  <button
                    type="button"
                    onClick={() => setExpandedId(expanded ? null : appointment._id)}
                    aria-expanded={expanded}
                  >
                    {expanded ? "Hide details" : "View details"}
                  </button>

                  {appointment.status === "pending" && (
                    <button
                      type="button"
                      disabled={cancellingId === appointment._id}
                      onClick={() => cancelAppointment(appointment)}
                    >
                      {cancellingId === appointment._id
                        ? "Cancelling…"
                        : "Cancel request"}
                    </button>
                  )}
                </div>

                {expanded && (
                  <div className="appointment-extra">
                    <p>Requested: {formatDate(appointment.createdAt)}</p>
                    <p>Appointment status: {appointment.status}</p>
                    <p>Payment status: {appointment.paymentStatus}</p>
                    {appointment.message && (
                      <p>Your message: {appointment.message}</p>
                    )}
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </main>
  )
}