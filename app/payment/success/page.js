"use client"

import Link from "next/link"
import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

const apiUrl = process.env.NEXT_PUBLIC_API_URL

function PaymentResult() {
  const params = useSearchParams()
  const sessionId = params.get("session_id")
  const [status, setStatus] = useState("processing")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!sessionId) {
      setError("Payment reference is missing.")
      return
    }

    let attempts = 0
    let timer
    let stopped = false

    async function checkPayment() {
      try {
        const response = await fetch(
          `${apiUrl}/api/customer/payments/session/${encodeURIComponent(sessionId)}`,
          {
            credentials: "include",
            cache: "no-store",
          },
        )

        if (!response.ok) {
          throw new Error("Could not check payment status.")
        }

        const result = await response.json()

        if (stopped) return

        if (result.status === "paid") {
          setStatus("paid")
          return
        }

        attempts += 1

        if (attempts < 10) {
          timer = setTimeout(checkPayment, 2000)
        }
      } catch (checkError) {
        if (!stopped) setError(checkError.message)
      }
    }

    checkPayment()

    return () => {
      stopped = true
      clearTimeout(timer)
    }
  }, [sessionId])

  return (
    <main className="studio-page">
      <p className="eyebrow">SalonBook payment</p>
      <h1>{status === "paid" ? "Payment confirmed" : "Checking your payment"}</h1>
      {error ? (
        <p role="alert">{error}</p>
      ) : status === "paid" ? (
        <p>Your appointment payment has been recorded.</p>
      ) : (
        <p role="status">
          Stripe has returned you to SalonBook. Check My Appointments if
          confirmation takes a little longer.
        </p>
      )}
      <Link className="primary-action" href="/dashboard/customer/appointments">
        View my appointments
      </Link>
    </main>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="studio-page">
          <p role="status">Checking your payment…</p>
        </main>
      }
    >
      <PaymentResult />
    </Suspense>
  )
}