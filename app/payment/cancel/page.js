import Link from "next/link"

export default function PaymentCancelPage() {
  return (
    <main className="studio-page">
      <p className="eyebrow">Stripe Checkout</p>
      <h1>Payment cancelled</h1>
      <p>Your appointment is still waiting for payment. You can try again from My Appointments.</p>
      <Link className="primary-action" href="/dashboard/customer/appointments">
        Back to my appointments
      </Link>
    </main>
  )
}