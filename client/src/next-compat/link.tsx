import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
}

const EVENT_START = 'routeChangeStart'
const EVENT_COMPLETE = 'routeChangeComplete'

function normalize(url: string) {
  try {
    const u = new URL(url, window.location.origin)
    return u.pathname + u.search + u.hash
  } catch {
    return url
  }
}

export default function Link({ href, onClick, target, rel, children, ...rest }: Props) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e)
    if (
      e.defaultPrevented ||
      (target && target !== '_self') ||
      (rel && rel.includes('external')) ||
      e.metaKey || e.altKey || e.ctrlKey || e.shiftKey || e.button !== 0
    ) {
      return
    }
    e.preventDefault()

    const curr = normalize(location.pathname + location.search + location.hash)
    const next = normalize(href)
    window.dispatchEvent(new CustomEvent(EVENT_START, { detail: { url: next } }))
    if (next !== curr) {
      navigate(next)
      // RouteEventsBridge will emit COMPLETE on location change
    } else {
      // Same URL: schedule a COMPLETE so listeners can react
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent(EVENT_COMPLETE, { detail: { url: next } }))
      }, 0)
    }
  }

  return (
    <a href={href} target={target} rel={rel} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}
