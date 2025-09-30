import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './style.css'

import Layout from './routes/Layout'
import Home from './routes/Home'
import About from './routes/About'
import Dashboard from './routes/Dashboard'
import Users from './routes/Users'
import User from './routes/User'
import TestLinks from './routes/TestLinks'
import NotFound from './routes/NotFound'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'users', element: <Users /> },
      { path: 'users/:userId', element: <User /> },
      { path: 'test-links', element: <TestLinks /> },
      { path: '*', element: <NotFound /> },
    ],
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)

