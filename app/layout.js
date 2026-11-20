export const metadata = {
  title: "SalonBook",
  description: "Explore salon services and book an appointment online.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}