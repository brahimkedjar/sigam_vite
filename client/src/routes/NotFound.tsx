import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div>
      <h1>404 - Not Found</h1>
      <p>The page you were looking for does not exist.</p>
      <p>
        <Link to="/">Go back home</Link>
      </p>
    </div>
  )
}

