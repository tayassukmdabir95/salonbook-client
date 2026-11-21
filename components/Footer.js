
"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import styles from "./NavigationFooter.module.css"

function Icon({ name, size = 19 }) {
  const paths = {
    home: <><path d="m3 10 9-7 9 7" /><path d="M5 9v11h14V9" /><path d="M9 20v-7h6v7" /></>,
    services: <><circle cx="6" cy="6" r="2" /><circle cx="18" cy="6" r="2" /><path d="m8 8 8 8M16 8 8 16" /><circle cx="6" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></>,
    dashboard: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    location: <><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    mail: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="m3 7 9 7 9-7" /></>,
    phone: <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.13.96.36 1.9.69 2.8a2 2 0 0 1-.45 2.11L8.1 9.9a16 16 0 0 0 6 6l1.3-1.24a2 2 0 0 1 2.1-.45c.9.33 1.84.56 2.8.69A2 2 0 0 1 22 16.9Z" />,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    instagram: <><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="18" cy="6" r="1" fill="currentColor" stroke="none" /></>,
    facebook: <path d="M15 21v-8h3l.5-4H15V7c0-1.2.5-2 2-2h2V2.2A20 20 0 0 0 16.2 2C13.4 2 11 3.7 11 7v2H8v4h3v8" />,
    youtube: <><rect x="2" y="5" width="20" height="14" rx="4" /><path d="m10 9 5 3-5 3z" /></>,
  }

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  )
}

export default function Footer() {
  const [year, setYear] = useState(2026)

  useEffect(() => {
    setYear(new Date().getFullYear())
  }, [])

  const links = [
    { label: "Home", href: "/", icon: "home" },
    { label: "Explore Services", href: "/services", icon: "services" },
    { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  ]

  const socialLinks = [
    { label: "Instagram", href: "https://www.instagram.com/", icon: "instagram" },
    { label: "Facebook", href: "https://www.facebook.com/", icon: "facebook" },
    { label: "YouTube", href: "https://www.youtube.com/", icon: "youtube" },
  ]

  return (
    <footer className={styles.footer}>
      <div className={styles.footerGlow} aria-hidden="true" />

      <div className={styles.footerInner}>
        <div className={styles.footerCta}>
          <div>
            <span className={styles.footerEyebrow}>
              <span className={styles.footerSparkle}>✦</span>
              YOUR BEAUTY, YOUR MOMENT
            </span>
            <h2>Good hair. Good mood. <em>Great day.</em></h2>
            <p>A little self-care goes a long way. Discover your next favorite salon experience.</p>
          </div>

          <Link href="/services" className={styles.footerCtaButton}>
            Book Your Moment
            <span><Icon name="arrow" size={20} /></span>
          </Link>
        </div>

        <div className={styles.footerRule} />

        <div className={styles.footerMain}>
          <div className={styles.footerBrandColumn}>
            <Link href="/" className={styles.footerBrand}>
              <span className={styles.footerBrandMark}>✦</span>
              Salon<span>Book.</span>
            </Link>

            <p className={styles.footerDescription}>
              A beautiful way to book your next beauty experience.
              Explore professional salon services, discover your perfect
              match, and make time for yourself.
            </p>

            <div className={styles.footerSocials}>
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialButton}
                  aria-label={social.label}
                  title={social.label}
                >
                  <Icon name={social.icon} size={20} />
                </a>
              ))}
            </div>
          </div>

          <div className={styles.footerColumn}>
            <span className={styles.footerColumnEyebrow}>DISCOVER</span>
            <h3>Explore</h3>

            <div className={styles.footerLinks}>
              {links.map((link) => (
                <Link key={link.href} href={link.href} className={styles.footerLink}>
                  <span className={styles.footerLinkIcon}>
                    <Icon name={link.icon} size={17} />
                  </span>
                  <span>{link.label}</span>
                  <span className={styles.footerLinkArrow}>↗</span>
                </Link>
              ))}
            </div>
          </div>

          <div className={styles.footerColumn}>
            <span className={styles.footerColumnEyebrow}>SAY HELLO</span>
            <h3>Get in Touch</h3>

            <div className={styles.footerContactList}>
              <div className={styles.footerContactItem}>
                <span className={styles.footerContactIcon}>
                  <Icon name="location" />
                </span>
                <div>
                  <strong>Visit Us</strong>
                  <p>Dhanmondi 27, Dhaka 1209, Bangladesh</p>
                </div>
              </div>

              <div className={styles.footerContactItem}>
                <span className={styles.footerContactIcon}>
                  <Icon name="phone" />
                </span>
                <div>
                  <strong>Call Us</strong>
                  <a href="tel:+8801700000000">+880 1700-000000</a>
                </div>
              </div>

              <div className={styles.footerContactItem}>
                <span className={styles.footerContactIcon}>
                  <Icon name="mail" />
                </span>
                <div>
                  <strong>Email Us</strong>
                  <a href="mailto:hello@salonbook.example">
                    hello@salonbook.example
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.footerColumn}>
            <span className={styles.footerColumnEyebrow}>PLAN YOUR VISIT</span>
            <h3>Opening Hours</h3>

            <div className={styles.footerHoursCard}>
              <span className={styles.footerHoursIcon}>
                <Icon name="clock" size={23} />
              </span>

              <div className={styles.footerHoursRows}>
                <div>
                  <span>Sat – Thu</span>
                  <strong>10 AM – 8 PM</strong>
                </div>
                <div>
                  <span>Friday</span>
                  <strong>2 PM – 9 PM</strong>
                </div>
              </div>

              <div className={styles.footerHoursNote}>
                <span className={styles.footerStatusDot} />
                Book online anytime
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p>© {year} SalonBook. All rights reserved.</p>
          <p>Made with <span>♥</span> for beautiful moments.</p>
          <Link href="/" className={styles.footerBack}>
            Back to Home <span>↑</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
