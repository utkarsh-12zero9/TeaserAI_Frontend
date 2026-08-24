import React from 'react';
import { useLocation } from 'react-router-dom';
import { Film } from 'lucide-react';

export const Footer: React.FC = () => {
  const location = useLocation();

  // Hide footer on the /generator route
  if (location.pathname === '/generator') {
    return null;
  }

  return (
    <footer className="footer container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <img src="/Nav_Logo.jpg" alt="TeaserAI Logo" style={{ height: '24px', width: 'auto', objectFit: 'contain', borderRadius: '3px' }} />
        <span style={{ fontSize: '0.9rem', color: '#888893' }}>— Video Teaser Generator</span>
      </div>
      <p style={{ margin: 0 }}>
        Powered by FastAPI, FFmpeg video processing & Speech-to-Text AI. Built with React.
      </p>
    </footer>
  );
};
