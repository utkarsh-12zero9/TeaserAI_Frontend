import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Video, Scissors } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div style={{ paddingTop: '2.5rem', paddingBottom: '5rem' }}>
      {/* Topographic Background Overlay */}
      <div className="topo-pattern" />

      {/* Hero Section */}
      <section style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 3.5rem', padding: '0 1rem' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            background: 'rgba(236, 72, 153, 0.1)',
            border: '1px solid rgba(236, 72, 153, 0.3)',
            borderRadius: '999px',
            fontSize: '0.85rem',
            color: 'var(--primary-pink)',
            fontWeight: 600,
            marginBottom: '1.25rem',
          }}
        >
          <Sparkles size={16} /> AI Powered Teaser Generator
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 4rem)',
            lineHeight: 1.15,
            marginBottom: '1.25rem',
            color: '#ffffff',
          }}
        >
          Transform Long Videos into <span className="gradient-text">Engaging Teasers</span>
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.2rem)',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginBottom: '2rem',
            fontWeight: 400,
          }}
        >
          Upload your raw video, let our backend extract speech-to-text transcripts, identify peak viral moments, and automatically slice a ready-to-share teaser.
        </p>

        <div className="hero-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/generator" className="btn-primary">
            <Sparkles size={18} /> Get Started Now <ArrowRight size={18} />
          </Link>
          {/* <a href="#how-it-works" className="btn-secondary">
            Learn How It Works
          </a> */}
        </div>
      </section>

      {/* Feature Grid */}
      <section className="container" style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.85rem', marginBottom: '0.5rem', color: '#ffffff' }}>
            Built for <span className="gradient-text-cyan">Creators & Editors</span>
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Streamlined pipeline from long-form content to short viral highlights
          </p>
        </div>

        <div className="grid-2">
          <div className="glass-card">
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(236, 72, 153, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-pink)',
                marginBottom: '1rem',
              }}
            >
              <Video size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem', color: '#ffffff' }}>Single Video Focus</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
              Simple, uncluttered interface designed to take one video file at a time and produce a high-impact teaser without any complexities.
            </p>
          </div>

          <div className="glass-card">
            <div
              style={{
                width: '44px',
                height: '44px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-cyan)',
                marginBottom: '1rem',
              }}
            >
              <Scissors size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.4rem', color: '#ffffff' }}>FFmpeg & Speech AI</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5, margin: 0 }}>
              Precision audio extraction and timestamped transcript analysis isolate key hooks, punchlines, and core insights automatically.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="container">
        <div
          className="glass-card"
          style={{
            background: 'linear-gradient(135deg, rgba(147, 51, 234, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
            borderColor: 'var(--border-neon)',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
          }}
        >
          <h2 style={{ fontSize: '1.85rem', marginBottom: '0.85rem', color: '#ffffff' }}>Ready to Generate Your Cool Teaser?</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 1.75rem', fontSize: '0.95rem' }}>
            No complicated setup. Just Upload your file directly and get a cool teaser video preview in seconds.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/generator" className="btn-primary" style={{ padding: '0.9rem 2.2rem', fontSize: '1rem' }}>
              Open Studio Generator <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
