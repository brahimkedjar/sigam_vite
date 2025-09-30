// Ensure CSS Modules are typed as an object map
declare module '*.module.css' {
  const classes: { readonly [className: string]: string }
  export default classes
}
declare module '*.module.scss' {
  const classes: { readonly [className: string]: string }
  export default classes
}
declare module '*.module.sass' {
  const classes: { readonly [className: string]: string }
  export default classes
}
declare module '*.module.less' {
  const classes: { readonly [className: string]: string }
  export default classes
}

// Allow side-effect imports of global styles without creating a default export
declare module '*.css'
declare module '*.scss'
declare module '*.sass'
declare module '*.less'
