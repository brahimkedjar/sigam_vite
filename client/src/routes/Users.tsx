import { Link } from 'react-router-dom'

const demoUsers = [
  { id: '1', name: 'Ada Lovelace' },
  { id: '2', name: 'Alan Turing' },
  { id: '3', name: 'Grace Hopper' },
]

export default function Users() {
  return (
    <div>
      <h1>Users</h1>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {demoUsers.map((u) => (
          <li key={u.id}>
            <Link to={`/users/${u.id}`}>{u.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

