
const apiUrl = process.env.NEXT_PUBLIC_API_URL

export async function uploadProfilePhoto(file) {
  if (!file) return ""

  const form = new FormData()
  form.append("image", file)

  const response = await fetch(`${apiUrl}/api/profile-upload`, {
    method: "POST",
    credentials: "include",
    body: form,
  })

  const result = await response.json().catch(() => null)

  if (!response.ok || !result?.image) {
    throw new Error(result?.message || "Could not upload your photo.")
  }

  return result.image
}
