import "./globals.css"
import { Toaster } from "react-hot-toast"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

export const metadata = {
  title: "SalonBook",
  description: "Explore salon services and book an appointment online.",
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <Footer />
        <Toaster position="top-center" />
      </body>
    </html>
  )
}