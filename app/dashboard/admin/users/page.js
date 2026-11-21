"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"

const apiUrl = process.env.NEXT_PUBLIC_API_URL

export default function ManageUsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [error, setError] = useState("")

  async function loadUsers() {
    const response = await fetch(`${apiUrl}/api/admin/users`, {
      credentials: "include",
      cache: "no-store",
    })

    if (response.status === 401) {
      router.replace("/sign-in")
      return
    }

    if (response.status === 403) {
      router.replace("/dashboard")
      return
    }

    if (!response.ok) throw new Error("Could not load customers.")

    const result = await response.json()
    setUsers(result.users)
    setLoading(false)
  }

  useEffect(() => {
    loadUsers().catch((loadError) => {
      setError(loadError.message)
      setLoading(false)
    })
  }, [])

  async function changeBlocked(user) {
    const action = user.isBlocked ? "Unblock" : "Block"

    if (!window.confirm(`${action} ${user.name}?`)) return

    setBusyId(user._id)

    try {
      const response = await fetch(
        `${apiUrl}/api/admin/users/${user._id}/block`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isBlocked: !user.isBlocked }),
        },
      )

      const result = await response.json()

      if (!response.ok) throw new Error(result.message)

      toast.success(result.message)
      await loadUsers()
    } catch (actionError) {
      toast.error(actionError.message || "Could not update the customer.")
    } finally {
      setBusyId(null)
    }
  }

  return (
    <main className="admin-table-page">
      <Link href="/dashboard/admin">← Admin overview</Link>
      <p className="eyebrow">Salon community</p>
      <h1>Manage customers</h1>

      {loading && <p role="status">Loading customers…</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && users.length === 0 && <p>No customers yet.</p>}

      <div className="admin-record-list">
        {users.map((user) => (
          <article className="admin-record user-record" key={user._id}>
            {user.image && <img src={user.image} alt="" />}
            <div>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
              <p>
                Status: <strong>{user.isBlocked ? "Blocked" : "Active"}</strong>
              </p>
              {user.createdAt && (
                <p>
                  Registered:{" "}
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
            <button
              type="button"
              disabled={busyId === user._id}
              onClick={() => changeBlocked(user)}
            >
              {busyId === user._id
                ? "Updating…"
                : user.isBlocked
                  ? "Unblock"
                  : "Block"}
            </button>
          </article>
        ))}
      </div>
    </main>
  )
}