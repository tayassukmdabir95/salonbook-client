"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({
    name: "",
    image: "",
    phone: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const controller = new AbortController()

    async function loadProfile() {
      try {
        const response = await fetch(`${apiUrl}/api/profile`, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        })

        if (response.status === 401) {
          router.replace("/sign-in")
          return
        }

        const result = await response.json()

        if (response.status === 403) {
          setError(result.message)
          return
        }

        if (!response.ok) {
          throw new Error(result.message)
        }

        setProfile(result.user)
        setForm({
          name: result.user.name || "",
          image: result.user.image || "",
          phone: result.user.phone || "",
        })
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(loadError.message || "Could not load your profile.")
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadProfile()
    return () => controller.abort()
  }, [router])

  function changeField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function saveProfile(event) {
    event.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`${apiUrl}/api/profile`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message)
      }

      setProfile(result.user)
      window.dispatchEvent(new Event("salonbook-auth-changed"))
      toast.success("Profile updated.")
    } catch (saveError) {
      toast.error(saveError.message || "Could not save your profile.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="profile-page">
      <Link href={profile ? `/dashboard/${profile.role}` : "/dashboard"}>
        ← Dashboard
      </Link>

      <div className="profile-heading">
        <p className="eyebrow">Your account</p>
        <h1>My profile</h1>
        <p>Update how SalonBook shows your name and contact information.</p>
      </div>

      {loading && <p role="status">Loading your profile…</p>}
      {error && <p role="alert">{error}</p>}

      {profile && (
        <form className="profile-form" onSubmit={saveProfile}>
          <div className="profile-identity">
            {form.image ? (
              <img src={form.image} alt="Your profile preview" />
            ) : (
              <span aria-hidden="true">
                {form.name.trim().charAt(0).toUpperCase() || "S"}
              </span>
            )}
            <div>
              <strong>{profile.email}</strong>
              <p>{profile.role === "admin" ? "Administrator" : "Customer"}</p>
            </div>
          </div>

          <label>
            Full name
            <input
              name="name"
              value={form.name}
              onChange={changeField}
              minLength={2}
              maxLength={80}
              required
            />
          </label>

          <label>
            Profile image URL
            <input
              name="image"
              type="url"
              value={form.image}
              onChange={changeField}
              placeholder="https://example.com/photo.jpg"
            />
          </label>

          <label>
            Phone number
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={changeField}
              maxLength={30}
              placeholder="+1 555 123 4567"
            />
          </label>

          <button className="primary-action" type="submit" disabled={saving}>
            {saving ? "Saving…" : "Save profile"}
          </button>
        </form>
      )}
    </main>
  )
}