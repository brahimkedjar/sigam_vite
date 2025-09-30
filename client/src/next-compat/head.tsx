import React, { useEffect } from 'react'

export default function Head({ children }: { children?: React.ReactNode }) {
  // Very small subset: supports <title> only
  useEffect(() => {
    const titles: string[] = []
    React.Children.forEach(children, (child) => {
      if (!child || typeof child !== 'object') return
      // @ts-expect-error accessing props on ReactElement
      if (child.type === 'title' && child.props?.children) {
        // @ts-expect-error
        titles.push(Array.isArray(child.props.children) ? child.props.children.join('') : child.props.children)
      }
    })
    if (titles.length) document.title = titles.join(' ')
  }, [children])
  return null
}

