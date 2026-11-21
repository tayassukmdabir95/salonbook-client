"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    async function loadUser() {
      try {
        const response = await fetch(`${apiUrl}/api/me`, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        })

        if (response.ok) {
          const result = await response.json()
          setUser(result.user)
        } else {
          setUser(null)
        }
      } catch {
        if (!controller.signal.aborted) setUser(null)
      } finally {
        if (!controller.signal.aborted) setReady(true)
      }
    }

    loadUser()
    window.addEventListener("salonbook-auth-changed", loadUser)

    return () => {
      controller.abort()
      window.removeEventListener("salonbook-auth-changed", loadUser)
    }
  }, [pathname])

  async function signOut() {
    try {
      const response = await fetch(`${apiUrl}/api/auth/sign-out`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: "{}",
      })

      if (!response.ok) throw new Error()

      setUser(null)
      setOpen(false)
      window.dispatchEvent(new Event("salonbook-auth-changed"))
      toast.success("You have signed out.")
      router.replace("/")
    } catch {
      toast.error("Sign-out failed. Please try again.")
    }
  }

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <Link className="site-logo" href="/">SalonBook<span>✦</span></Link>

        <div className="site-nav-links">
          <Link href="/">Home</Link>
          <Link href="/services">Browse services</Link>
        </div>

        <div className="site-nav-account">
          {!ready && <span role="status">Loading account…</span>}
          {ready && !user && (
            <>
              <Link href="/sign-in">Sign in</Link>
              <Link className="nav-join" href="/sign-up">Join SalonBook</Link>
            </>
          )}
          {ready && user && (
            <div className="account-menu">
              <button
                type="button"
                aria-expanded={open}
                aria-controls="account-options"
                onClick={() => setOpen(!open)}
              >
                {user.name} <span aria-hidden="true">⌄</span>
              </button>
              {open && (
                <div id="account-options" className="account-options">
                  <Link
                    href={`/dashboard/${user.role}`}
                    onClick={() => setOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link href="/dashboard/profile" onClick={() => setOpen(false)}>
                    My profile
                  </Link>
                  <button type="button" onClick={signOut}>Sign out</button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}