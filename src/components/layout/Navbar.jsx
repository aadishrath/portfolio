import { useCallback, useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';
import useFocusDialog from '../../hooks/useFocusDialog';

function Navbar({ onHomeClick, toggleTheme, theme }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/frontend', label: 'Frontend Projects' },
    { to: '/projects', label: 'ML Projects' },
  ];

  const drawerRef = useRef(null);
  const closeMenu = useCallback(() => setIsMenuOpen(false), []);
  useFocusDialog(drawerRef, isMenuOpen, closeMenu);
  useEffect(() => {
    const media = window.matchMedia('(min-width: 769px)');
    const handleResize = () => { if (media.matches) closeMenu(); };
    media.addEventListener('change', handleResize);
    return () => media.removeEventListener('change', handleResize);
  }, [closeMenu]);

  function handleNavClick(event, label) {
    if (label === 'Home' && window.location.pathname === '/') {
      event.preventDefault();
      onHomeClick();
    }

    setIsMenuOpen(false);
  }

  return (
    <>
      <nav className="navbar" aria-label="Main navigation">
        <button
          type="button"
          className="mobile-toggle"
          onClick={() => setIsMenuOpen((current) => !current)}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
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

          <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label="Toggle dark theme" aria-pressed={theme === 'dark'}>
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

      <aside ref={drawerRef} id="mobile-navigation" className={`mobile-drawer ${isMenuOpen ? 'open' : ''}`} role="dialog" aria-modal={isMenuOpen ? true : undefined} aria-label="Navigation menu" tabIndex={-1} aria-hidden={!isMenuOpen} inert={!isMenuOpen}>
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
        </div>

        <button type="button" className="mobile-theme-toggle" onClick={toggleTheme} aria-pressed={theme === 'dark'}>
          Toggle theme
        </button>
      </aside>
    </>
  );
}

export default Navbar;
