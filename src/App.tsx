import { useEffect, useState } from "react"

function App() {
  const [health, setHealth] = useState<any>(null)
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    fetch("/api/health")
      .then(res => res.json())
      .then(setHealth)

    fetch("/api/users")
      .then(res => res.json())
      .then(setUsers)
  }, [])

  return (
    <div style={{ padding: 24 }}>
      <h1>Moajim</h1>

      <h2>API Health</h2>
      <pre>{JSON.stringify(health, null, 2)}</pre>

      <h2>Users</h2>
      <ul>
        {users.map(u => (
          <li key={u.id}>{u.name}</li>
        ))}
      </ul>
    </div>
  )
}

export default App
