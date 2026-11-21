"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

const apiUrl = process.env.NEXT_PUBLIC_API_URL

const emptyService = {
  serviceName: "",
  category: "",
  description: "",
  price: "",
  duration: "",
  image: "",
  status: "active",
}

const categories = [
  "Haircut & Styling",
  "Hair Coloring",
  "Hair Treatment",
  "Facial & Skincare",
  "Makeup",
  "Manicure & Pedicure",
  "Spa & Massage",
]

export default function ManageServicesPage() {
  const router = useRouter()
  const [services, setServices] = useState([])
  const [form, setForm] = useState(emptyService)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [uploading, setUploading] = useState(false)

  async function loadServices() {
    const response = await fetch(`${apiUrl}/api/admin/services`, {
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
      throw new Error("Could not load services.")
    }

    const result = await response.json()
    setServices(result.services)
    setLoading(false)
  }

  useEffect(() => {
    loadServices().catch(() => {
      toast.error("Could not load services.")
      setLoading(false)
    })
  }, [])

  function changeField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function uploadImage(event) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)

    try {
      const body = new FormData()
      body.append("image", file)

      const response = await fetch(`${apiUrl}/api/admin/uploads`, {
        method: "POST",
        credentials: "include",
        body,
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message)
      }

      setForm((current) => ({ ...current, image: result.image }))
      toast.success("Image uploaded.")
    } catch (error) {
      toast.error(error.message || "Image upload failed.")
    } finally {
      setUploading(false)
    }
  }

  async function saveService(event) {
    event.preventDefault()

    if (!form.image) {
      toast.error("Upload a service image first.")
      return
    }

    setBusy(true)

    try {
      const endpoint = editingId
        ? `${apiUrl}/api/admin/services/${editingId}`
        : `${apiUrl}/api/admin/services`

      const response = await fetch(endpoint, {
        method: editingId ? "PUT" : "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message)
      }

      toast.success(editingId ? "Service updated." : "Service created.")
      setEditingId(null)
      setForm(emptyService)
      await loadServices()
    } catch (error) {
      toast.error(error.message || "Could not save the service.")
    } finally {
      setBusy(false)
    }
  }

  function editService(service) {
    setEditingId(service._id)
    setForm({
      serviceName: service.serviceName,
      category: service.category,
      description: service.description,
      price: String(service.price),
      duration: String(service.duration),
      image: service.image,
      status: service.status,
    })
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function changeStatus(service) {
    setBusy(true)

    try {
      const response = await fetch(
        `${apiUrl}/api/admin/services/${service._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...service,
            status: service.status === "active" ? "inactive" : "active",
          }),
        },
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message)
      }

      toast.success("Service status updated.")
      await loadServices()
    } catch (error) {
      toast.error(error.message || "Could not update the status.")
    } finally {
      setBusy(false)
    }
  }

  async function deleteService(service) {
    if (!window.confirm(`Delete ${service.serviceName}?`)) return

    setBusy(true)

    try {
      const response = await fetch(
        `${apiUrl}/api/admin/services/${service._id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      )

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message)
      }

      toast.success("Service deleted.")
      await loadServices()
    } catch (error) {
      toast.error(error.message || "Could not delete the service.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="services-admin">
      <Link href="/dashboard/admin">← Admin overview</Link>
      <h1>Manage services</h1>

      <form className="service-form" onSubmit={saveService}>
        <h2>{editingId ? "Edit service" : "Add a service"}</h2>

        <label>
          Service name
          <input
            name="serviceName"
            value={form.serviceName}
            onChange={changeField}
            required
          />
        </label>

        <label>
          Category
          <select
            name="category"
            value={form.category}
            onChange={changeField}
            required
          >
            <option value="">Choose a category</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={changeField}
            rows="4"
            required
          />
        </label>

        <div className="service-form-row">
          <label>
            Price
            <input
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              value={form.price}
              onChange={changeField}
              required
            />
          </label>

          <label>
            Duration in minutes
            <input
              name="duration"
              type="number"
              min="1"
              step="1"
              value={form.duration}
              onChange={changeField}
              required
            />
          </label>
        </div>

        <label>
          Service image
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={uploadImage}
          />
        </label>
        <p role="status">
          {uploading
            ? "Uploading image…"
            : form.image
              ? "Image ready"
              : "Choose a JPG, PNG, or WebP image up to 5 MB."}
        </p>

        {form.image && (
          <img className="service-preview" src={form.image} alt="Service preview" />
        )}

        <label>
          Status
          <select name="status" value={form.status} onChange={changeField}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </label>

        <div className="service-form-actions">
          <button className="primary-action" disabled={busy || uploading}>
            {busy ? "Saving…" : editingId ? "Save changes" : "Create service"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null)
                setForm(emptyService)
              }}
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <section className="service-list">
        <h2>All services</h2>
        {loading && <p role="status">Loading services…</p>}
        {!loading && services.length === 0 && <p>No services yet.</p>}

        {services.map((service) => (
          <article className="service-admin-card" key={service._id}>
            <img src={service.image} alt="" />
            <div>
              <h3>{service.serviceName}</h3>
              <p>{service.category} · {service.duration} min · ${service.price}</p>
              <span className="service-status">{service.status}</span>
            </div>
            <div className="service-card-actions">
              <button disabled={busy} onClick={() => editService(service)}>
                Edit
              </button>
              <button disabled={busy} onClick={() => changeStatus(service)}>
                {service.status === "active" ? "Deactivate" : "Activate"}
              </button>
              <button disabled={busy} onClick={() => deleteService(service)}>
                Delete
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}