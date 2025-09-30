import { NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div>
      <nav>
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/users">Users</NavLink>
        <NavLink to="/users/1">User 1</NavLink>
        <NavLink to="/users/2">User 2</NavLink>
        <NavLink to="/test-links">Test Links</NavLink>
      </nav>

      <Outlet />
    </div>
  )
}

