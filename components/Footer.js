import Link from "next/link"

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <Link className="footer-logo" href="/">SalonBook ✦</Link>
          <p>Thoughtful salon services and an easier way to reserve time for yourself.</p>
        </div>

        <div>
          <h2>Explore</h2>
          <Link href="/">Home</Link>
          <Link href="/services">Services</Link>
          <Link href="/dashboard">Dashboard</Link>
        </div>

        <div>
          <h2>Visit & contact</h2>
          <p>123 Studio Lane, Your City</p>
          <p>Mon–Sat · 9:00 AM–7:00 PM</p>
          <a href="mailto:hello@salonbook.example">hello@salonbook.example</a>
        </div>

        <div>
          <h2>Follow</h2>
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">
            Facebook
          </a>
        </div>
      </div>
      <p className="footer-bottom">© {new Date().getFullYear()} SalonBook. All rights reserved.</p>
    </footer>
  )
}