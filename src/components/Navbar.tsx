import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Film, Sparkles, ArrowRight, Menu, X, LogOut, User } from 'lucide-react';
import { useAuth } from './AuthContext';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isGenerator = location.pathname === '/generator';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

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
        <nav className="nav-links desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" className="btn-secondary nav-home-btn" style={{ background: 'transparent', border: 'none' }}>
            Home
          </Link>
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {!isGenerator && (
                <Link to="/generator" className="btn-primary nav-cta">
                  <Sparkles size={15} /> <span>Generator</span>
                </Link>
              )}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 0.8rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '999px',
                fontSize: '0.85rem',
                color: '#fff'
              }}>
                <User size={14} style={{ color: 'var(--primary-pink)' }} />
                <span>{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.4rem 0.8rem',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '0.85rem'
                }}
              >
                <LogOut size={14} /> <span>Logout</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn-secondary" style={{ padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                Sign In
              </Link>
              <Link to="/register" className="btn-primary nav-cta" style={{ padding: '0.4rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                Sign Up
              </Link>
            </div>
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
        <nav className="mobile-menu-dropdown" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.5rem' }}>
          <Link to="/" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          
          {user ? (
            <>
              <Link to="/generator" className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                Generator
              </Link>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.6rem 1rem',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                fontSize: '0.9rem',
                color: '#fff'
              }}>
                <User size={16} style={{ color: 'var(--primary-pink)' }} />
                <span>{user.email}</span>
              </div>
              <button
                onClick={() => {
                  handleLogout();
                  setMobileMenuOpen(false);
                }}
                className="btn-secondary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  padding: '0.6rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  fontSize: '0.9rem',
                  width: '100%'
                }}
              >
                <LogOut size={16} /> Logout
              </button>
            </>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', marginTop: '0.5rem' }}>
              <Link
                to="/login"
                className="btn-secondary"
                style={{ display: 'flex', justifyContent: 'center', padding: '0.6rem 1rem', borderRadius: '8px' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-primary"
                style={{ display: 'flex', justifyContent: 'center', padding: '0.6rem 1rem', borderRadius: '8px' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign Up
              </Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
};

