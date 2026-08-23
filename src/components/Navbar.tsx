import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Film, Sparkles, ArrowRight, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const isGenerator = location.pathname === '/generator';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        <Link to="/" className="brand-logo">
          <div className="brand-icon">
            <Film size={18} />
          </div>
          <span className="brand-text">
            Teaser<span style={{ color: 'var(--primary-pink)' }}>AI</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="nav-links desktop-nav">
          {isGenerator ? (
            <Link to="/" className="btn-secondary nav-home-btn">
              Home
            </Link>
          ) : (
            <Link to="/generator" className="btn-primary nav-cta">
              <Sparkles size={15} /> <span>Get Started</span> <ArrowRight size={15} />
            </Link>
          )}
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu Overlay */}
      {mobileMenuOpen && (
        <nav className="mobile-menu-dropdown">
          <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          {!isGenerator && (
            <Link
              to="/generator"
              className="btn-primary"
              style={{ justifyContent: 'center', width: '100%', marginTop: '0.5rem' }}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Sparkles size={16} /> Get Started <ArrowRight size={16} />
            </Link>
          )}
        </nav>
      )}
    </header>
  );
};
