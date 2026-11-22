import Link from "next/link"

export default function NotFoundPage() {
  return (
    <main className="site-message-page">
      <p className="eyebrow">Page not found maybe dealing with 404...</p>
      <h1>This page has slipped away.</h1>
      <p>The address may have changed. You can return home or browse salon services.</p>
      <div className="site-message-actions">
        <Link className="primary-action" href="/">Go home</Link>
        <Link href="/services">Browse services</Link>
      </div>
    </main>
  )
}