import { Icon } from './Icon.jsx'

function Header() {
  return (
    <header className="topbar">
      <a className="brand" href="#top" aria-label="Algo Studio home">
        <span className="brand-mark"><Icon name="layers" size={19} /></span>
        <span>algo<span className="brand-light">studio</span></span>
      </a>
      <div className="topbar-right">
        <span className="topbar-label">INTERACTIVE LEARNING</span>
        <span className="topbar-divider" />
        <span className="language-pill"><span className="language-dot" /> C language</span>
      </div>
    </header>
  )
}

export default Header
