import Link from "next/link"

export default function HomePage() {
  return (
    <main className="studio-page">
      <h1>SalonBook</h1>
      <p>Explore salon services and book your next appointment online.</p>
      <nav className="studio-actions" aria-label="Account">
        <Link className="primary-action" href="/sign-up">
          Create an account
        </Link>
        <Link href="/sign-in">Sign in</Link>
      </nav>
    </main>
  )
}