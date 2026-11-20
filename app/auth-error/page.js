import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <main className="studio-page">
      <h1>Google sign-in didn’t finish</h1>
      <p>Try Google again or sign in with your email and password.</p>
      <Link className="primary-action" href="/sign-in">
        Back to sign in
      </Link>
    </main>
  )
}