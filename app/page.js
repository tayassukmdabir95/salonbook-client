"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import ServiceCard from "../components/ServiceCard"

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export default function HomePage() {
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
        if (!controller.signal.aborted) {
          setError("Services could not be loaded. Refresh to try again.")
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadServices()
    return () => controller.abort()
  }, [])

  const categories = [...new Set(services.map((service) => service.category))]
  const featured = services.slice(0, 6)

  return (
    <main>
      <section className="salon-hero">
        <div className="salon-hero-content">
          <p className="eyebrow">Your next moment of calm starts here</p>
          <h1>Make room for feeling beautiful.</h1>
          <p>
            Explore expert salon care, find your favorite service, and request
            a time that works for you.
          </p>
          <Link className="hero-action" href="/services">
            Explore salon services <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <div className="salon-hero-photo" role="img" aria-label="Warm, welcoming salon interior" />
      </section>

      <section className="home-section" aria-labelledby="featured-title">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Made for your moment</p>
            <h2 id="featured-title">Featured services</h2>
          </div>
          <Link href="/services">Browse all services ↗</Link>
        </div>

        {loading && <p role="status">Loading salon services…</p>}
        {error && <p role="alert">{error}</p>}
        {!loading && !error && featured.length === 0 && (
          <p>Services are being prepared. Check back soon.</p>
        )}

        <div className="salon-card-grid">
          {featured.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      </section>

      <section className="category-section" aria-labelledby="category-title">
        <div className="home-section">
          <p className="eyebrow">Find your kind of care</p>
          <h2 id="category-title">Explore by category</h2>
          <div className="category-grid">
            {categories.map((category, index) => (
              <Link
                key={category}
                href={`/services?category=${encodeURIComponent(category)}`}
                className="category-tile"
              >
                <span className="category-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{category}</span>
                <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section booking-story">
        <div>
          <p className="eyebrow">Simple from the first click</p>
          <h2>Time for yourself, without the back and forth.</h2>
        </div>
        <div className="story-steps">
          <p><strong>Explore</strong><span>Find a service that feels right.</span></p>
          <p><strong>Request</strong><span>Choose a date and available time.</span></p>
          <p><strong>Enjoy</strong><span>Relax while the salon confirms your visit.</span></p>
        </div>
      </section>
    </main>
  )
}