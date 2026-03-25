import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar({ onContactClick, onHomeClick, toggleTheme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/projects', label: 'ML Projects' },
    { to: '/frontend', label: 'FE Projects' },
    { to: '/sentiment', label: 'Sentiment Analysis' },
    { to: '/rag', label: 'RAG' },
  ];

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  function handleNavClick(event, label) {
    if (label === 'Contact') {
      event.preventDefault();
      setIsMenuOpen(false);
      onContactClick();
      return;
    }

    if (label === 'Home' && window.location.pathname === '/') {
      event.preventDefault();
      onHomeClick();
    }

    setIsMenuOpen(false);
  }

  return (
    <>
      <nav className="navbar">
        <button
          type="button"
          className="mobile-toggle"
          onClick={() => setIsMenuOpen((current) => !current)}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <div className="desktop-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={(event) => handleNavClick(event, item.label)}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {item.label}
            </NavLink>
          ))}
          <button className="contact-btn" onClick={onContactClick}>Contact</button>

          <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label="Toggle color theme">
            <span className="theme-toggle-label theme-toggle-label--light">Light</span>
            <div className="knob"></div>
            <span className="theme-toggle-label theme-toggle-label--dark">Dark</span>
          </button>
        </div>
      </nav>

      <div
        className={`mobile-overlay ${isMenuOpen ? 'open' : ''}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden={!isMenuOpen}
      />

      <aside className={`mobile-drawer ${isMenuOpen ? 'open' : ''}`} aria-hidden={!isMenuOpen}>
        <div className="mobile-drawer-header">
          <strong>Aadish Rathore</strong>
          <button
            type="button"
            className="mobile-close"
            onClick={() => setIsMenuOpen(false)}
            aria-label="Close navigation menu"
          >
            X
          </button>
        </div>

        <div className="mobile-nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={(event) => handleNavClick(event, item.label)}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              {item.label}
            </NavLink>
          ))}
          <button type="button" className="mobile-contact-btn" onClick={(event) => handleNavClick(event, 'Contact')}>
            Contact
          </button>
        </div>

        <button type="button" className="mobile-theme-toggle" onClick={toggleTheme}>
          Toggle theme
        </button>
      </aside>
    </>
  );
}

export default Navbar;
