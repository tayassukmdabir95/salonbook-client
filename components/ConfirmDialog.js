
"use client"

import { useEffect, useRef } from "react"
import styles from "./ConfirmDialog.module.css"

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Go Back",
  variant = "danger",
  loading = false,
  onConfirm,
  onCancel,
}) {
  const cancelRef = useRef(null)

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    cancelRef.current?.focus()

    function handleEscape(event) {
      if (event.key === "Escape" && !loading) onCancel()
    }

    window.addEventListener("keydown", handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener("keydown", handleEscape)
    }
  }, [open, loading, onCancel])

  if (!open) return null

  return (
    <div
      className={styles.overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !loading) onCancel()
      }}
    >
      <div
        className={styles.dialog}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-message"
      >
        <div className={styles.top}>
          <span className={`${styles.icon} ${styles[variant]}`}>
            {variant === "danger" ? "!" : "✓"}
          </span>

          <button
            type="button"
            className={styles.close}
            onClick={onCancel}
            disabled={loading}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        <h2 id="confirm-title">{title}</h2>
        <p id="confirm-message">{message}</p>

        <div className={styles.actions}>
          <button
            type="button"
            ref={cancelRef}
            className={styles.cancel}
            disabled={loading}
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className={`${styles.confirm} ${styles[variant]}`}
            disabled={loading}
            onClick={onConfirm}
          >
            {loading ? "Processing…" : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
