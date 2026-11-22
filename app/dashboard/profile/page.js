
"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import ProfilePhotoInput from "../../../components/ProfilePhotoInput"
import { uploadProfilePhoto } from "../../../lib/uploadProfilePhoto"

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({
    name: "",
    image: "",
    phone: "",
  })
  const [imageFile, setImageFile] = useState(null)
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

        if (!response.ok) {
          throw new Error(result.message || "Could not load your profile.")
        }

        if (controller.signal.aborted) return

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
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }))
  }

  async function saveProfile(event) {
    event.preventDefault()
    if (saving) return

    setSaving(true)

    try {
      let image = form.image.trim()

      if (imageFile) {
        image = await uploadProfilePhoto(imageFile)
      }

      const response = await fetch(`${apiUrl}/api/profile`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          image,
          phone: form.phone,
        }),
      })

      const result = await response.json().catch(() => null)

      if (!response.ok) {
        throw new Error(result?.message || "Could not save your profile.")
      }

      setProfile(result.user)
      setForm({
        name: result.user.name || "",
        image: result.user.image || "",
        phone: result.user.phone || "",
      })
      setImageFile(null)

      window.dispatchEvent(new Event("salonbook-auth-changed"))
      toast.success("Profile updated successfully!")
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
        <p>Personalize your SalonBook profile and contact information.</p>
      </div>

      {loading && <p role="status">Loading your profile…</p>}
      {error && <p role="alert">{error}</p>}

      {profile && (
        <form className="profile-form" onSubmit={saveProfile}>
          <div className="profile-identity">
            <div>
              <strong>{profile.email}</strong>
              <p>{profile.role === "admin" ? "Administrator" : "Customer"}</p>
            </div>
          </div>

          <ProfilePhotoInput
            value={form.image}
            onChange={(image) => setForm((current) => ({ ...current, image }))}
            file={imageFile}
            onFileChange={setImageFile}
          />

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
            Phone number
            <input
              name="phone"
              type="tel"
              value={form.phone}
              onChange={changeField}
              maxLength={30}
              placeholder="+880 1XXXXXXXXX"
            />
          </label>

          <button className="primary-action" type="submit" disabled={saving}>
            {saving ? "Saving profile…" : "Save Profile"}
          </button>
        </form>
      )}
    </main>
  )
}
