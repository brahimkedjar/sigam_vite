import { Link, useLocation, useSearchParams } from 'react-router-dom'

export default function TestLinks() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()

  const currentTab = searchParams.get('tab') ?? 'info'

  return (
    <div>
      <h1>Test Links</h1>
      <p>Quick links to try navigation and search params:</p>

      <div style={{ display: 'flex', gap: '.75rem', justifyContent: 'center' }}>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/users">Users</Link>
        <Link to="/users/42">User 42</Link>
      </div>

      <hr style={{ margin: '2rem 0', opacity: 0.25 }} />

      <h2>Search Params</h2>
      <p>Current location: <code>{location.pathname + location.search}</code></p>
      <div style={{ display: 'flex', gap: '.5rem', justifyContent: 'center' }}>
        <Link to="?tab=info">?tab=info</Link>
        <Link to="?tab=settings">?tab=settings</Link>
        <Link to="?tab=activity">?tab=activity</Link>
      </div>
      <p style={{ marginTop: '1rem' }}>
        Active tab: <strong>{currentTab}</strong>
      </p>
      <button onClick={() => setSearchParams({})}>Clear search</button>
    </div>
  )
}

