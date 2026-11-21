"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export default function ServiceDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const [service, setService] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()

    async function loadDetails() {
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

        if (userResponse.status === 403) {
          setError("This account cannot access service details.")
          return
        }

        if (!userResponse.ok) throw new Error()

        const response = await fetch(`${apiUrl}/api/services`, {
          cache: "no-store",
          signal: controller.signal,
        })

        if (!response.ok) throw new Error()

        const result = await response.json()
        const found = result.services.find((item) => item._id === id)

        if (!found) {
          setError("This service is unavailable or the link is invalid.")
          return
        }

        setService(found)
      } catch {
        if (!controller.signal.aborted) {
          setError("Could not load this service. Refresh to try again.")
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadDetails()
    return () => controller.abort()
  }, [id, router])

  return (
    <main className="home-section service-details">
      <Link href="/services">← Browse services</Link>
      {loading && <p role="status">Loading service details…</p>}
      {error && <p role="alert">{error}</p>}
      {service && (
        <div className="service-details-grid">
          <img src={service.image} alt={service.serviceName} />
          <div>
            <p className="eyebrow">{service.category}</p>
            <h1>{service.serviceName}</h1>
            <p>{service.description}</p>
            <div className="details-meta">
              <span>${Number(service.price).toFixed(2)}</span>
              <span>{service.duration} minutes</span>
            </div>
            <p>Appointment requests will open with the booking form in Step 8.</p>
          </div>
        </div>
      )}
    </main>
  )
}