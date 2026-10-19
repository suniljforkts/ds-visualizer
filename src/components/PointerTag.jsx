export function PointerTag({ children, muted = false, className = '' }) {
  if (children === undefined || children === null) return null
  return <span className={`pointer-tag ${muted ? 'muted' : ''} ${className}`}>{children}</span>
}

export default PointerTag
