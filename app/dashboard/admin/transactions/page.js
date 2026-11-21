"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export default function TransactionsPage() {
  const router = useRouter()
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const controller = new AbortController()

    async function loadTransactions() {
      try {
        const response = await fetch(`${apiUrl}/api/admin/transactions`, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        })

        if (response.status === 401) {
          router.replace("/sign-in")
          return
        }

        if (response.status === 403) {
          router.replace("/dashboard")
          return
        }

        if (!response.ok) throw new Error()

        const result = await response.json()
        setTransactions(result.transactions)
      } catch {
        if (!controller.signal.aborted) {
          setError("Could not load transactions.")
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    loadTransactions()
    return () => controller.abort()
  }, [router])

  return (
    <main className="admin-table-page">
      <Link href="/dashboard/admin">← Admin overview</Link>
      <p className="eyebrow">Payment activity</p>
      <h1>Transactions</h1>

      {loading && <p role="status">Loading transactions…</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && transactions.length === 0 && (
        <p>No payments have been recorded yet.</p>
      )}

      <div className="admin-record-list">
        {transactions.map((transaction) => (
          <article className="admin-record" key={transaction._id}>
            <div className="admin-record-heading">
              <div>
                <p className="eyebrow">
                  {transaction.service?.category || "Salon service"}
                </p>
                <h2>
                  {transaction.service?.serviceName || "Service unavailable"}
                </h2>
              </div>
              <span className="appointment-status status-confirmed">
                {transaction.status}
              </span>
            </div>

            <div className="admin-record-facts">
              <p><strong>Customer</strong> {transaction.customer?.name || "Unknown"}</p>
              <p><strong>Email</strong> {transaction.customer?.email || "—"}</p>
              <p><strong>Appointment</strong> {transaction.appointmentDate || "—"}</p>
              <p>
                <strong>Amount</strong>{" "}
                {Number(transaction.amount).toFixed(2)}{" "}
                {transaction.currency.toUpperCase()}
              </p>
              <p>
                <strong>Reference</strong>{" "}
                {transaction.stripeSessionId.slice(0, 24)}…
              </p>
              <p>
                <strong>Paid</strong>{" "}
                {new Date(transaction.createdAt).toLocaleString()}
              </p>
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}