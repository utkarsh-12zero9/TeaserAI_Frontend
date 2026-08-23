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
        <Film size={18} color="var(--primary-cyan)" />
        <span style={{ fontWeight: 600, color: '#fff' }}>TeaserAI</span> - Video Teaser Generator
      </div>
      <p style={{ margin: 0 }}>
        Powered by FastAPI, FFmpeg video processing & Speech-to-Text AI. Built with React.
      </p>
    </footer>
  );
};
