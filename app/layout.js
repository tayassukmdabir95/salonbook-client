import "./globals.css"
import { Toaster } from "react-hot-toast"

export const metadata = {
  title: "SalonBook",
  description: "Explore salon services and book an appointment online.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}