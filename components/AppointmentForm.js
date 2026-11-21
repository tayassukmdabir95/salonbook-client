"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export default function AppointmentForm({ serviceId, role }) {
  const [date, setDate] = useState("")
  const [slots, setSlots] = useState([])
  const [timeSlot, setTimeSlot] = useState("")
  const [message, setMessage] = useState("")
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [created, setCreated] = useState(false)

  useEffect(() => {
    if (!date || role !== "customer") {
      setSlots([])
      setTimeSlot("")
      return
    }

    const controller = new AbortController()

    async function loadSlots() {
      setLoadingSlots(true)
      setTimeSlot("")

      try {
        const response = await fetch(
          `${apiUrl}/api/appointments/slots?date=${encodeURIComponent(date)}`,
          {
            credentials: "include",
            cache: "no-store",
            signal: controller.signal,
          },
        )

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.message)
        }

        setSlots(result.slots)
      } catch (error) {
        if (!controller.signal.aborted) {
          toast.error(error.message || "Could not load available times.")
          setSlots([])
        }
      } finally {
        if (!controller.signal.aborted) setLoadingSlots(false)
      }
    }

    loadSlots()
    return () => controller.abort()
  }, [date, role])

  async function submitAppointment(event) {
    event.preventDefault()

    if (!timeSlot || submitting) {
      toast.error("Choose an available time.")
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch(`${apiUrl}/api/appointments`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          appointmentDate: date,
          timeSlot,
          message,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message)
      }

      setCreated(true)
      toast.success("Appointment request sent.")
    } catch (error) {
      toast.error(error.message || "Could not send your request.")
    } finally {
      setSubmitting(false)
    }
  }

  if (role === "admin") {
    return (
      <section className="booking-panel">
        <h2>Appointments are for customers</h2>
        <p>Admin accounts manage requests from the dashboard.</p>
        <Link href="/dashboard/admin">Open admin dashboard</Link>
      </section>
    )
  }

  if (created) {
    return (
      <section className="booking-panel">
        <h2>Request received</h2>
        <p>The salon will review your appointment. Its status starts as pending.</p>
        <Link className="primary-action" href="/dashboard/customer">
          Open my dashboard
        </Link>
      </section>
    )
  }

  const today = new Date().toISOString().slice(0, 10)

  return (
    <section className="booking-panel" aria-labelledby="booking-title">
      <p className="eyebrow">Make time for yourself</p>
      <h2 id="booking-title">Request an appointment</h2>

      <form onSubmit={submitAppointment}>
        <label>
          Appointment date
          <input
            type="date"
            min={today}
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />
        </label>

        <label>
          Available time
          <select
            value={timeSlot}
            onChange={(event) => setTimeSlot(event.target.value)}
            disabled={!date || loadingSlots || slots.length === 0}
            required
          >
            <option value="">
              {loadingSlots ? "Loading times…" : "Choose a time"}
            </option>
            {slots.map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </label>

        {date && !loadingSlots && slots.length === 0 && (
          <p role="status">No times are available on this date.</p>
        )}

        <label>
          Message to the salon (optional)
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            maxLength={500}
            rows={4}
            placeholder="Share anything the salon should know"
          />
        </label>

        <button
          className="primary-action"
          type="submit"
          disabled={submitting || loadingSlots || !timeSlot}
        >
          {submitting ? "Sending request…" : "Request appointment"}
        </button>
      </form>
    </section>
  )
}