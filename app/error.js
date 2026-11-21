"use client"

import Link from "next/link"

export default function ErrorPage({ reset }) {
  return (
    <main className="site-message-page">
      <p className="eyebrow">Something went wrong</p>
      <h1>Let’s try that again.</h1>
      <p>The page could not load right now. Retry or return to the homepage.</p>
      <div className="site-message-actions">
        <button className="primary-action" type="button" onClick={reset}>
          Try again
        </button>
        <Link href="/">Go home</Link>
      </div>
    </main>
  )
}