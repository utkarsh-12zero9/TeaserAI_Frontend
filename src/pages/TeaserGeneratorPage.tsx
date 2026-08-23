import React, { useState } from 'react';
import { VideoUploader } from '../components/VideoUploader';
import { ProcessingState } from '../components/ProcessingState';
import { VideoPreview } from '../components/VideoPreview';
import { ProcessingStatus, PipelineStep, SelectedVideoInfo, TeaserResult } from '../types/teaser';
import { processVideoTeaser } from '../services/teaserApi';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const TeaserGeneratorPage: React.FC = () => {
  const [status, setStatus] = useState<ProcessingStatus>('INITIAL');
  const [selectedVideo, setSelectedVideo] = useState<SelectedVideoInfo | null>(null);
  const [pipelineStep, setPipelineStep] = useState<PipelineStep>('idle');
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [teaserResult, setTeaserResult] = useState<TeaserResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectVideo = (video: SelectedVideoInfo) => {
    setSelectedVideo(video);
    setStatus('VIDEO_SELECTED');
    setErrorMessage(null);
  };

  const handleClearVideo = () => {
    if (selectedVideo?.objectUrl) {
      URL.revokeObjectURL(selectedVideo.objectUrl);
    }
    setSelectedVideo(null);
    setStatus('INITIAL');
    setTeaserResult(null);
    setErrorMessage(null);
  };

  const handleGenerateTeaser = async () => {
    if (!selectedVideo) return;

    setStatus('UPLOADING');
    setPipelineStep('uploading');
    setProgressPercent(10);
    setErrorMessage(null);

    try {
      const result = await processVideoTeaser(selectedVideo, (step, percent) => {
        if (step === 'uploading') setStatus('UPLOADING');
        else setStatus('PROCESSING');

        setPipelineStep(step);
        setProgressPercent(percent);
      });

      setTeaserResult(result);
      setStatus('SUCCESS');
      setPipelineStep('complete');
    } catch (err) {
      console.error('Generation Error:', err);
      setStatus('ERROR');
      setErrorMessage(
        err instanceof Error ? err.message : 'An error occurred during teaser generation. Please try again.'
      );
    }
  };

  return (
    <div className="container" style={{ paddingTop: '1.5rem', paddingBottom: '5rem' }}>
      {/* Merged Title & Back Button Header Container */}
      <div className="workspace-header-bar">
        <Link to="/" className="btn-back">
          <ArrowLeft size={16} /> Go Back
        </Link>
        <div className="workspace-header-text">
          <h1 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 2.4rem)', marginBottom: '0.2rem' }}>
            Teaser Generator <span className="gradient-text">Workspace</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
            Upload your video file and generate a teaser preview.
          </p>
        </div>
      </div>

      {/* Global Error Banner */}
      {status === 'ERROR' && errorMessage && (
        <div className="alert-banner alert-error" style={{ maxWidth: '700px', margin: '0 auto 1.5rem' }}>
          <AlertCircle size={20} />
          <div>
            <strong>Generation Failed:</strong> {errorMessage}
          </div>
        </div>
      )}

      {/* Main Content Card */}
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {(status === 'INITIAL' || status === 'VIDEO_SELECTED' || status === 'ERROR') && (
          <VideoUploader
            selectedVideo={selectedVideo}
            onSelectVideo={handleSelectVideo}
            onClearVideo={handleClearVideo}
            onGenerate={handleGenerateTeaser}
          />
        )}

        {(status === 'UPLOADING' || status === 'PROCESSING') && (
          <div className="glass-card" style={{ textAlign: 'center' }}>
            <ProcessingState currentStep={pipelineStep} progressPercent={progressPercent} />
          </div>
        )}

        {status === 'SUCCESS' && teaserResult && (
          <div className="glass-card">
            <VideoPreview result={teaserResult} onReset={handleClearVideo} />
          </div>
        )}
      </div>
    </div>
  );
};
