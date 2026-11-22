
"use client"

import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import styles from "./ProfilePhotoInput.module.css"

export default function ProfilePhotoInput({
  value,
  onChange,
  file,
  onFileChange,
}) {
  const [mode, setMode] = useState("upload")
  const [preview, setPreview] = useState("")
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (!file) {
      setPreview(value || "")
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    return () => URL.revokeObjectURL(objectUrl)
  }, [file, value])

  function clearFileInput() {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  function removePhoto() {
    clearFileInput()
    onFileChange(null)
    onChange("")
    setPreview("")
  }

  function chooseFile(event) {
    const selected = event.target.files?.[0]

    if (!selected) return

    const allowed = ["image/jpeg", "image/png", "image/webp"]

    if (!allowed.includes(selected.type)) {
      toast.error("Choose a JPG, PNG or WebP image.")
      clearFileInput()
      return
    }

    if (selected.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB.")
      clearFileInput()
      return
    }

    onFileChange(selected)
  }

  function changeMode(nextMode) {
    setMode(nextMode)

    if (nextMode === "url") {
      clearFileInput()
      onFileChange(null)
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.heading}>
        <div className={styles.previewWrapper}>
          <div className={styles.preview}>
            {preview ? (
              <img
                key={preview}
                src={preview}
                alt="Profile photo preview"
                onError={(event) => {
                  event.currentTarget.style.display = "none"
                }}
              />
            ) : (
              <span aria-hidden="true">SB</span>
            )}
          </div>

          {(file || value) && (
            <button
              type="button"
              className={styles.removePhoto}
              aria-label="Remove profile photo"
              title="Remove photo"
              onClick={removePhoto}
            >
              ×
            </button>
          )}
        </div>

        <div>
          <strong>Profile photo</strong>
          <p>Optional • Add a photo your way</p>
        </div>
      </div>

      <div className={styles.tabs}>
        <button
          type="button"
          className={mode === "upload" ? styles.active : ""}
          onClick={() => changeMode("upload")}
          aria-pressed={mode === "upload"}
        >
          Upload from device
        </button>

        <button
          type="button"
          className={mode === "url" ? styles.active : ""}
          onClick={() => changeMode("url")}
          aria-pressed={mode === "url"}
        >
          Image URL
        </button>
      </div>

      {mode === "upload" ? (
        <div className={styles.uploadArea}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={chooseFile}
            aria-label="Choose profile image"
          />

          <span>
            {file ? file.name : "Choose a profile picture"}
          </span>

          <small>JPG, PNG, WebP • Maximum 5 MB</small>
        </div>
      ) : (
        <label className={styles.urlField}>
          Image URL
          <input
            type="url"
            value={value || ""}
            onChange={(event) => onChange(event.target.value)}
            placeholder="https://example.com/photo.jpg"
          />
        </label>
      )}
    </div>
  )
}
