import React from 'react';
import { PipelineStep } from '../types/teaser';
import { Cpu, Music, MessageSquareText, Sparkles, Scissors, CheckCircle2 } from 'lucide-react';

interface ProcessingStateProps {
  currentStep: PipelineStep;
  progressPercent: number;
}

export const ProcessingState: React.FC<ProcessingStateProps> = ({ currentStep, progressPercent }) => {
  const safePercent = Math.min(
    100,
    Math.max(0, typeof progressPercent === 'number' && !isNaN(progressPercent) ? progressPercent : 0)
  );

  const steps: { key: PipelineStep; label: string; icon: React.ReactNode }[] = [
    { key: 'uploading', label: 'Uploading video file', icon: <Cpu size={16} /> },
    { key: 'extracting_audio', label: 'Extracting audio track', icon: <Music size={16} /> },
    { key: 'speech_to_text', label: 'Generating speech-to-text transcript', icon: <MessageSquareText size={16} /> },
    { key: 'analyzing_moments', label: 'Analyzing best moments', icon: <Sparkles size={16} /> },
    { key: 'clipping_teaser', label: 'Generating final teaser', icon: <Scissors size={16} /> },
  ];

  const getStepIndex = (step: PipelineStep) => {
    return steps.findIndex((s) => s.key === step);
  };

  const currentIndex = getStepIndex(currentStep);

  return (
    <div className="teaser-container-wrapper">
      <div className="teaser-aspect-box processing-box">
        {/* Animated Skeleton Shimmer Layer */}
        <div className="shimmer-skeleton" />

        {/* Processing Overlay */}
        <div className="processing-overlay">
          <div className="spinner-ring" />

          <h4 className="font-display gradient-text" style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>
            Generating Teaser...
          </h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Processing pipeline in progress
          </p>

          <div className="progress-bar-container">
            <div className="progress-bar-fill" style={{ width: `${safePercent}%` }} />
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--primary-cyan)', fontWeight: 600 }}>
            {safePercent}%
          </span>

          {/* Pipeline Step List */}
          <div
            style={{
              marginTop: '1.25rem',
              width: '100%',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            {steps.map((s, idx) => {
              const isDone = idx < currentIndex;
              const isCurrent = idx === currentIndex;

              return (
                <div
                  key={s.key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    fontSize: '0.78rem',
                    color: isCurrent
                      ? '#ffffff'
                      : isDone
                        ? 'var(--primary-cyan)'
                        : 'rgba(255, 255, 255, 0.3)',
                    fontWeight: isCurrent ? 600 : 400,
                  }}
                >
                  {isDone ? (
                    <CheckCircle2 size={14} color="var(--primary-cyan)" />
                  ) : (
                    <span style={{ display: 'flex', opacity: isCurrent ? 1 : 0.4 }}>{s.icon}</span>
                  )}
                  <span>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
