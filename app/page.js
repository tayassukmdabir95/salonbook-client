
"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import ServiceCard from "../components/ServiceCard"
import styles from "./CategorySection.module.css"
import highlights from "./HomeHighlights.module.css"

const apiUrl = process.env.NEXT_PUBLIC_API_URL

function CategoryIcon({ category }) {
  const name = category.toLowerCase()

  let icon = "sparkles"

  if (name.includes("hair") || name.includes("color") || name.includes("cut")) {
    icon = "scissors"
  } else if (name.includes("nail") || name.includes("manicure") || name.includes("pedicure")) {
    icon = "nails"
  } else if (name.includes("facial") || name.includes("skin")) {
    icon = "face"
  } else if (name.includes("makeup") || name.includes("bridal")) {
    icon = "beauty"
  } else if (name.includes("spa") || name.includes("massage")) {
    icon = "flower"
  } else if (name.includes("beard") || name.includes("shav")) {
    icon = "razor"
  }

  const paths = {
    scissors: (
      <>
        <circle cx="6" cy="6" r="3" />
        <circle cx="6" cy="18" r="3" />
        <path d="M8.2 8.2 20 20M14 10 20 4 8.2 15.8" />
      </>
    ),
    nails: (
      <>
        <path d="M7 12V7a2 2 0 0 1 4 0v4" />
        <path d="M11 11V5a2 2 0 0 1 4 0v6" />
        <path d="M15 11V8a2 2 0 0 1 4 0v7" />
        <path d="M7 11a2 2 0 0 0-4 0v4c0 4 3 7 7 7h3c4 0 6-3 6-7" />
      </>
    ),
    face: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M8 10h.01M16 10h.01M9 16c2 2 4 2 6 0" />
        <path d="M12 12v2" />
      </>
    ),
    beauty: (
      <>
        <path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z" />
        <path d="m19 17 .7 2.3L22 20l-2.3.7L19 23l-.7-2.3L16 20l2.3-.7z" />
      </>
    ),
    flower: (
      <>
        <path d="M12 12c-7-8-10-2-6 1 2 1 4 1 6-1Z" />
        <path d="M12 12c7-8 10-2 6 1-2 1-4 1-6-1Z" />
        <path d="M12 12c-5 8 1 11 3 6 1-2 0-4-3-6Z" />
        <path d="M12 12c5 8-1 11-3 6-1-2 0-4 3-6Z" />
        <path d="M12 12V3" />
      </>
    ),
    razor: (
      <>
        <rect x="5" y="4" width="14" height="7" rx="2" />
        <path d="M8 11v8a4 4 0 0 0 8 0v-8M9 7h6" />
      </>
    ),
    sparkles: (
      <>
        <path d="m12 2 2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" />
      </>
    ),
  }

  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[icon]}
    </svg>
  )
}

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
        if (!controller.signal.aborted) setServices(result.services)
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

      <section className={highlights.featured} aria-labelledby="featured-title">
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

      <section className={styles.section} aria-labelledby="category-title">
        <div className={styles.container}>
          <div className={styles.heading}>
            <div>
              <span className={styles.eyebrow}>
                <span className={styles.sparkle}>✦</span>
                DISCOVER YOUR STYLE
              </span>

              <h2 id="category-title">
                Explore by <em>category.</em>
              </h2>

              <p>
                Your next favorite look is just a click away.
                Find the perfect treatment for your mood.
              </p>
            </div>

            <Link href="/services" className={styles.browseAll}>
              View all services
              <span aria-hidden="true">↗</span>
            </Link>
          </div>

          {loading && (
            <p className={styles.categoryMessage} role="status">
              Discovering categories…
            </p>
          )}

          {!loading && !error && categories.length === 0 && (
            <p className={styles.categoryMessage}>
              Categories will appear as services are added.
            </p>
          )}

          {!loading && categories.length > 0 && (
            <div className={styles.grid}>
              {categories.map((category, index) => (
                <Link
                  key={category}
                  href={`/services?category=${encodeURIComponent(category)}`}
                  className={styles.card}
                >
                  <span className={styles.iconBox}>
                    <CategoryIcon category={category} />
                  </span>

                  <span className={styles.cardContent}>
                    <span className={styles.cardName}>{category}</span>
                    <span className={styles.cardSubtitle}>
                      Explore services
                    </span>
                  </span>

                  <span className={styles.cardArrow} aria-hidden="true">
                    ↗
                  </span>
                </Link>
              ))}
            </div>
          )}

          {!loading && categories.length > 0 && (
            <div className={styles.bottomNote}>
              <span className={styles.bottomStar}>✳</span>
              A little self-care looks good on everyone.
              <span className={styles.bottomStar}>✳</span>
            </div>
          )}
        </div>
      </section>

      <section className={`booking-story ${highlights.story}`}>
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
