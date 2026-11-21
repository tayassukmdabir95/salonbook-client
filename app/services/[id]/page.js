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
        const response = await fetch(`${apiUrl}/api/services/${id}`, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        })

        if (response.status === 401) {
          router.replace("/sign-in")
          return
        }

        const result = await response.json()

        if (!response.ok) {
          setError(result.message || "Could not load this service.")
          return
        }

        setService(result.service)
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