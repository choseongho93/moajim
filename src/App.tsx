import { useEffect, useState } from "react"

interface User {
  id: number
  name: string
}

interface Health {
  status: string
  service: string
}

function App() {
  const [health, setHealth] = useState<Health | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/health").then(res => res.json()),
      fetch("/api/users").then(res => res.json()),
    ])
      .then(([healthData, usersData]) => {
        setHealth(healthData)
        setUsers(usersData.users || [])
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50 text-gray-600">
        <p className="text-xl font-semibold animate-pulse">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-800">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-indigo-600">Moajim Dashboard</h1>
        <p className="text-gray-500 mt-1">Real-time API & User data</p>
      </header>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">API Health</h2>
        <div className="bg-white p-4 rounded shadow border border-gray-200">
          <pre className="text-sm text-gray-600">{JSON.stringify(health, null, 2)}</pre>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Users</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {users.map(u => (
            <div
              key={u.id}
              className="bg-white p-4 rounded shadow border border-gray-200 hover:shadow-lg transition"
            >
              <p className="font-medium text-gray-800">{u.name}</p>
              <p className="text-sm text-gray-500">ID: {u.id}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default App
