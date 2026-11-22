
"use client"

import { useState } from "react"

export default function PasswordInput({ isSignUp }) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="password-field">
      <input
        id="password"
        name="password"
        type={visible ? "text" : "password"}
        autoComplete={isSignUp ? "new-password" : "current-password"}
        aria-describedby={isSignUp ? "password-help" : undefined}
        required
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
      >
        {visible ? "Hide" : "View"}
      </button>
    </div>
  )
}
