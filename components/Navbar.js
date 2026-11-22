
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import styles from "./NavigationFooter.module.css"
import SalonLogo from "./SalonLogo"

const apiUrl = process.env.NEXT_PUBLIC_API_URL

function NavIcon({ name, size = 18 }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9" /><path d="M9 20v-7h6v7" /></>,
    services: <><path d="M4 7h16M4 12h16M4 17h16" /><circle cx="8" cy="7" r="2" /><circle cx="16" cy="12" r="2" /><circle cx="10" cy="17" r="2" /></>,
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
    logout: <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5M21 12H9" /></>,
    chevron: <path d="m6 9 6 6 6-6" />,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

function Avatar({ user, large = false }) {
  const image = user.image || user.picture || user.photoURL || user.avatar || ""
  const [failed, setFailed] = useState(false)
  const initial = (user.name || user.email || "S").trim().charAt(0).toUpperCase()

  useEffect(() => {
    setFailed(false)
  }, [image])

  return (
    <span className={`${styles.avatar} ${large ? styles.avatarLarge : ""}`}>
      {image && !failed ? (
        <img
          src={image}
          alt={`${user.name || "User"} avatar`}
          referrerPolicy="no-referrer"
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden="true">{initial}</span>
      )}
    </span>
  )
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const menuRef = useRef(null)
  const [user, setUser] = useState(null)
  const [ready, setReady] = useState(false)
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

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
          if (!controller.signal.aborted) setUser(result.user)
        } else {
          if (!controller.signal.aborted) setUser(null)
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

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15)

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    function handleOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") setOpen(false)
    }

    document.addEventListener("pointerdown", handleOutside)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("pointerdown", handleOutside)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

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
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ""}`}>
      <nav className={styles.nav} aria-label="Main navigation">
        <Link href="/" className={styles.brand}>
  <SalonLogo size={38} />
  <span>Salon<span className={styles.brandAccent}>Book.</span></span>
</Link>

        <div className={styles.navCenter}>
          <Link
            href="/"
            className={`${styles.navPill} ${pathname === "/" ? styles.navPillActive : ""}`}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            <NavIcon name="home" />
            <span>Home</span>
          </Link>

          <Link
            href="/services"
            className={`${styles.navPill} ${pathname.startsWith("/services") ? styles.navPillActive : ""}`}
            aria-current={pathname.startsWith("/services") ? "page" : undefined}
          >
            <NavIcon name="services" />
            <span>Browse Services</span>
          </Link>

{ready && user && (
  <Link
    href={`/dashboard/${user.role}`}
    className={`${styles.dashboardNavButton} ${
      pathname.startsWith("/dashboard")
        ? styles.dashboardNavActive
        : ""
    }`}
    aria-current={
      pathname.startsWith("/dashboard") ? "page" : undefined
    }
  >
    <NavIcon name="dashboard" size={17} />
    <span>Dashboard</span>
    <span className={styles.dashboardNavArrow} aria-hidden="true">
      ↗
    </span>
  </Link>
)}

          
        </div>

        <div className={styles.navAccount}>
          {!ready && <span className={styles.loading}>Loading…</span>}

          {ready && !user && (
            <div className={styles.guestActions}>
              <Link href="/sign-in" className={styles.signin}>Sign In</Link>
              <Link href="/sign-up" className={styles.join}>
                Sign Up <NavIcon name="arrow" size={16} />
              </Link>
            </div>
          )}

          {ready && user && (
            <div className={styles.accountMenu} ref={menuRef}>
              <button
                type="button"
                className={`${styles.accountTrigger} ${open ? styles.accountTriggerOpen : ""}`}
                aria-expanded={open}
                aria-haspopup="true"
                aria-controls="salonbook-account-dropdown"
                onClick={() => setOpen(!open)}
              >
                <Avatar user={user} />
                <span className={styles.accountIdentity}>
                  <strong>{user.name || "My Account"}</strong>
                  <small>{user.role === "admin" ? "Administrator" : "Customer"}</small>
                </span>
                <span className={`${styles.chevron} ${open ? styles.chevronOpen : ""}`}>
                  <NavIcon name="chevron" size={15} />
                </span>
              </button>

              {open && (
                <div id="salonbook-account-dropdown" className={styles.dropdown}>
                  <div className={styles.dropdownUser}>
                    <Avatar user={user} large />
                    <div className={styles.dropdownIdentity}>
                      <strong>{user.name || "SalonBook User"}</strong>
                      <span>{user.email}</span>
                    </div>
                  </div>

                  <div className={styles.dropdownDivider} />

                  <Link
                    href={`/dashboard/${user.role}`}
                    className={styles.dropdownLink}
                    onClick={() => setOpen(false)}
                  >
                    <span className={styles.dropdownIcon}><NavIcon name="dashboard" /></span>
                    Dashboard
                    <span className={styles.dropdownArrow}>↗</span>
                  </Link>

                  <Link
                    href="/dashboard/profile"
                    className={styles.dropdownLink}
                    onClick={() => setOpen(false)}
                  >
                    <span className={styles.dropdownIcon}><NavIcon name="user" /></span>
                    My Profile
                    <span className={styles.dropdownArrow}>↗</span>
                  </Link>

                  <div className={styles.dropdownDivider} />

                  <button type="button" className={styles.logout} onClick={signOut}>
                    <span className={styles.dropdownIcon}><NavIcon name="logout" /></span>
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
