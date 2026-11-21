"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import ServiceCard from "../../components/ServiceCard"

const apiUrl = process.env.NEXT_PUBLIC_API_URL

function ServicesContent() {
  const params = useSearchParams()
  const categoryFromLink = params.get("category") || ""
  const [services, setServices] = useState([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState(categoryFromLink)
  const [sort, setSort] = useState("featured")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    setCategory(categoryFromLink)
  }, [categoryFromLink])

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
          setError("Could not load services. Refresh to try again.")
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadServices()
    return () => controller.abort()
  }, [])

  const categories = useMemo(
    () => [...new Set(services.map((service) => service.category))].sort(),
    [services],
  )

  const visibleServices = useMemo(() => {
    const query = search.trim().toLocaleLowerCase()
    const results = services.filter((service) => {
      const matchesName = service.serviceName.toLocaleLowerCase().includes(query)
      const matchesCategory = !category || service.category === category
      return matchesName && matchesCategory
    })

    if (sort === "price-low") {
      return results.sort((a, b) => Number(a.price) - Number(b.price))
    }

    if (sort === "price-high") {
      return results.sort((a, b) => Number(b.price) - Number(a.price))
    }

    return results
  }, [services, search, category, sort])

  function clearFilters() {
    setSearch("")
    setCategory("")
    setSort("featured")
  }

  return (
    <main className="home-section browse-page">
      <div className="browse-intro">
        <p className="eyebrow">Find your next favorite</p>
        <h1>Browse services</h1>
        <p>Explore salon care and choose a service that fits your day.</p>
      </div>

      <div className="browse-controls">
        <label>
          Search by service name
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Try haircut or facial"
          />
        </label>

        <label>
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">All categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <label>
          Sort by price
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </label>
      </div>

      <div className="browse-results-heading">
        <p role="status">
          {loading
            ? "Loading services…"
            : `${visibleServices.length} ${visibleServices.length === 1 ? "service" : "services"} found`}
        </p>
        {(search || category || sort !== "featured") && (
          <button type="button" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      {error && <p role="alert">{error}</p>}
      {!loading && !error && visibleServices.length === 0 && (
        <p className="browse-empty">
          No services match your search. Try another name or category.
        </p>
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