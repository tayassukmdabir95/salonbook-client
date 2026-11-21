"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import ServiceCard from "../../components/ServiceCard"

const apiUrl = process.env.NEXT_PUBLIC_API_URL

function ServicesContent() {
  const params = useSearchParams()
  const selectedCategory = params.get("category")
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const controller = new AbortController()

    async function loadServices() {
      try {
        const response = await fetch(`${apiUrl}/api/services`, {
          cache: "no-store",
          signal: controller.signal,
        })

        if (!response.ok) throw new Error()

        const result = await response.json()
        setServices(result.services)
      } catch {
        if (!controller.signal.aborted) setError("Could not load services.")
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadServices()
    return () => controller.abort()
  }, [])

  const visibleServices = selectedCategory
    ? services.filter((service) => service.category === selectedCategory)
    : services

  return (
    <main className="home-section browse-page">
      <p className="eyebrow">Find your next favorite</p>
      <h1>{selectedCategory || "Browse services"}</h1>
      {loading && <p role="status">Loading services…</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && visibleServices.length === 0 && (
        <p>No active services are available in this category yet.</p>
      )}
      <div className="salon-card-grid">
        {visibleServices.map((service) => (
          <ServiceCard key={service._id} service={service} />
        ))}
      </div>
    </main>
  )
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={
        <main className="home-section browse-page">
          <p role="status">Loading services…</p>
        </main>
      }
    >
      <ServicesContent />
    </Suspense>
  )
}