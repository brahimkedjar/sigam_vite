import React from 'react'

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string
  alt: string
  width?: number | string
  height?: number | string
}

export default function Image(props: ImageProps) {
  const { style, width, height, ...rest } = props
  const w = typeof width === 'number' ? `${width}` : width
  const h = typeof height === 'number' ? `${height}` : height
  return <img {...rest} style={style} width={w} height={h} />
}

