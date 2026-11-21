"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import toast from "react-hot-toast"

const authUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth`

export default function AuthForm({ mode }) {
  const router = useRouter()
  const isSignUp = mode === "sign-up"
  const [pending, setPending] = useState(null)
  const busy = pending !== null

  async function continueWithGoogle() {
    if (busy) return
    setPending("google")

    try {
      const response = await fetch(`${authUrl}/sign-in/social`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: "google",
          callbackURL: `${window.location.origin}/dashboard`,
          errorCallbackURL: `${window.location.origin}/auth-error`,
          disableRedirect: true,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.url) {
        throw new Error(result.message || "Could not start Google sign-in.")
      }

      window.location.assign(result.url)
    } catch (error) {
      toast.error(error.message || "Google sign-in is unavailable. Please try again.")
      setPending(null)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (busy) return

    const form = new FormData(event.currentTarget)
    const email = form.get("email").trim()
    const password = form.get("password")
    const payload = { email, password }

    if (isSignUp) {
      const name = form.get("name").trim()
      const image = form.get("image").trim()

      if (!name) {
        toast.error("Enter your full name.")
        return
      }

      if (
        password.length < 6 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password)
      ) {
        toast.error("Use at least 6 characters with an uppercase and a lowercase letter.")
        return
      }

      payload.name = name
      if (image) payload.image = image
    }

    setPending("email")

    try {
      const endpoint = isSignUp ? "sign-up/email" : "sign-in/email"
      const response = await fetch(`${authUrl}/${endpoint}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const result = await response.json().catch(() => null)
        toast.error(result?.message || "Unable to complete your request.")
        return
      }
      window.dispatchEvent(new Event("salonbook-auth-changed"))


      
      toast.success(isSignUp ? "Your account has been created." : "Welcome back!")
      router.replace("/dashboard")
    } catch {
      toast.error("Could not reach SalonBook. Please try again.")
    } finally {
      setPending(null)
    }
  }

  return (
    <main className="auth-shell">
      <div className="auth-art">
        <Link className="wordmark" href="/">
          SalonBook
        </Link>
      </div>

      <section className="auth-panel" aria-labelledby="auth-title">
        <h1 id="auth-title">
          {isSignUp ? "Create your account" : "Sign in to SalonBook"}
        </h1>

        <button
          className="google-action"
          type="button"
          onClick={continueWithGoogle}
          disabled={busy}
        >
          {pending === "google" ? "Opening Google…" : "Continue with Google"}
        </button>

        <p className="auth-divider">or use email</p>

        <form onSubmit={handleSubmit} aria-busy={pending === "email"}>
          {isSignUp && (
            <p>
              <label htmlFor="name">Full name</label>
              <input id="name" name="name" autoComplete="name" required />
            </p>
          )}

          <p>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </p>

          <p>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete={isSignUp ? "new-password" : "current-password"}
              aria-describedby={isSignUp ? "password-help" : undefined}
              required
            />
            {isSignUp && (
              <small id="password-help">
                Use at least 6 characters, including an uppercase and a lowercase letter.
              </small>
            )}
          </p>

          {isSignUp && (
            <p>
              <label htmlFor="image">Profile image URL (optional)</label>
              <input
                id="image"
                name="image"
                type="url"
                placeholder="https://example.com/photo.jpg"
              />
            </p>
          )}

          <button className="primary-action" type="submit" disabled={busy}>
            {pending === "email" ? "Please wait…" : isSignUp ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="auth-switch">
          {isSignUp ? "Already have an account? " : "New to SalonBook? "}
          <Link href={isSignUp ? "/sign-in" : "/sign-up"}>
            {isSignUp ? "Sign in" : "Create an account"}
          </Link>
        </p>
      </section>
    </main>
  )
}