import Link from "next/link"

export default function PaymentSuccessPage() {
  return (
    <main className="studio-page">
      <p className="eyebrow">Stripe Checkout</p>
      <h1>Payment submitted</h1>
      <p>
        Stripe has returned you to SalonBook. Your payment status will appear
        in My Appointments after the salon receives payment confirmation.
      </p>
      <Link className="primary-action" href="/dashboard/customer/appointments">
        View my appointments
      </Link>
    </main>
  )
}