# SalonBook Client

SalonBook is a salon appointment booking platform. Customers can explore services, request appointments, manage bookings, and pay for confirmed appointments. Administrators manage salon services, appointment requests, customers, and payment transactions.

## Important features

- Responsive homepage with featured services and categories
- Service name search, category filtering, and price sorting
- Protected service details and appointment booking
- Email and password authentication and Google sign-in
- Customer and admin dashboards
- Customer appointment history, cancellation, and payment status
- Stripe Checkout for confirmed appointments
- Profile editing, loading states, error pages, and toast notifications

## Technology stack

- Next.js 16
- React 19
- JavaScript
- CSS
- React Hot Toast
- Better Auth and Express API provided by the server repository

## Installation

Use Node.js 24 or newer. Clone this repository and install dependencies:

```bash
git clone https://github.com/tayassukmdabir95/salonbook-client.git
cd salonbook-client
npm install
```

Create `.env.local` in the repository root. Use `.env.example` to see the required variable names. Start the SalonBook server before using authentication, services, bookings, or payments.

## Run locally

```bash
npm run dev
```

Open `http://localhost:3000`.

To verify the production build locally:

```bash
npm run build
npm run start
```

## Required environment variables

- `NEXT_PUBLIC_API_URL`
- `API_PROXY_TARGET`

For local development, `NEXT_PUBLIC_API_URL` points to the local Express API. For production, it points to the client’s own live origin. `API_PROXY_TARGET` points to the deployed Express server so Next.js can forward `/api` requests.

## Links

- Live website: https://salonbook-client-one.vercel.app/
- Client repository: https://github.com/tayassukmdabir95/salonbook-client
- Server repository: https://github.com/tayassukmdabir95/salonbook-server
