
"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import ConfirmDialog from "../../../../components/ConfirmDialog"

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
  const [confirmAction, setConfirmAction] = useState(null)

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

    if (!response.ok) {
      throw new Error("Could not load appointments.")
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

  function openConfirmation(appointment, action) {
    if (busyId !== null) return

    setConfirmAction({
      appointment,
      action,
    })
  }

  function closeConfirmation() {
    if (busyId !== null) return

    setConfirmAction(null)
  }

  async function changeStatus() {
    if (!confirmAction || busyId !== null) return

    const { appointment, action } = confirmAction

    setBusyId(appointment._id)

    try {
      const response = await fetch(
        `${apiUrl}/api/admin/appointments/${appointment._id}/${action}`,
        {
          method: "PATCH",
          credentials: "include",
        }
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Could not update the appointment.")
      }

      setConfirmAction(null)
      toast.success(result.message || "Appointment updated successfully.")

      await loadAppointments()
    } catch (actionError) {
      toast.error(
        actionError.message || "Could not update the appointment."
      )
    } finally {
      setBusyId(null)
    }
  }

  return (
    <main className="admin-table-page">
      <Link href="/dashboard/admin">
        ← Admin overview
      </Link>

      <p className="eyebrow">Salon schedule</p>
      <h1>Manage appointments</h1>

      {loading && (
        <p role="status">
          Loading appointments…
        </p>
      )}

      {error && (
        <p role="alert">
          {error}
        </p>
      )}

      {!loading && !error && appointments.length === 0 && (
        <p>No appointment requests yet.</p>
      )}

      <div className="admin-record-list">
        {appointments.map((appointment) => (
          <article
            className="admin-record"
            key={appointment._id}
          >
            <div className="admin-record-heading">
              <div>
                <p className="eyebrow">
                  {appointment.service?.category || "Salon service"}
                </p>

                <h2>
                  {appointment.service?.serviceName ||
                    "Service unavailable"}
                </h2>
              </div>

              <span
                className={`appointment-status status-${appointment.status}`}
              >
                {appointment.status}
              </span>
            </div>

            <div className="admin-record-facts">
              <p>
                <strong>Customer</strong>{" "}
                {appointment.customer?.name || "Unknown"}
              </p>

              <p>
                <strong>Email</strong>{" "}
                {appointment.customer?.email || "—"}
              </p>

              <p>
                <strong>Date</strong>{" "}
                {appointment.appointmentDate}
              </p>

              <p>
                <strong>Time</strong>{" "}
                {appointment.timeSlot}
              </p>

              <p>
                <strong>Price</strong>{" "}
                ${Number(appointment.servicePrice).toFixed(2)}
              </p>

              <p>
                <strong>Payment</strong>{" "}
                {appointment.paymentStatus}
              </p>

              <p>
                <strong>Requested</strong>{" "}
                {formatDate(appointment.createdAt)}
              </p>

              <p>
                <strong>Message</strong>{" "}
                {appointment.message || "None"}
              </p>
            </div>

            <div className="appointment-actions">
              {appointment.status === "pending" && (
                <button
                  type="button"
                  disabled={busyId !== null}
                  onClick={() =>
                    openConfirmation(appointment, "confirm")
                  }
                >
                  {busyId === appointment._id
                    ? "Updating…"
                    : "Confirm"}
                </button>
              )}

              {appointment.status !== "cancelled" && (
                <button
                  type="button"
                  disabled={busyId !== null}
                  onClick={() =>
                    openConfirmation(appointment, "cancel")
                  }
                >
                  {busyId === appointment._id
                    ? "Updating…"
                    : "Cancel"}
                </button>
              )}
            </div>
          </article>
        ))}
      </div>

      <ConfirmDialog
        open={Boolean(confirmAction)}
        title={
          confirmAction?.action === "confirm"
            ? "Confirm appointment?"
            : "Cancel appointment?"
        }
        message={
          confirmAction?.action === "confirm"
            ? `Are you sure you want to confirm the appointment for ${
                confirmAction?.appointment?.customer?.name || "this customer"
              }?`
            : `Are you sure you want to cancel the appointment for ${
                confirmAction?.appointment?.customer?.name || "this customer"
              }? This action may not be reversible.`
        }
        confirmText={
          confirmAction?.action === "confirm"
            ? "Yes, Confirm"
            : "Yes, Cancel"
        }
        cancelText="Go Back"
        variant={
          confirmAction?.action === "confirm"
            ? "success"
            : "danger"
        }
        loading={busyId !== null}
        onConfirm={changeStatus}
        onCancel={closeConfirmation}
      />
    </main>
  )
}
