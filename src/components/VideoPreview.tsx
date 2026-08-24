import React, { useRef, useState, useEffect } from 'react';
import { TeaserResult } from '../types/teaser';
import { Play, Pause, Volume2, VolumeX, Download, RefreshCw, Maximize, Sparkles, CheckCircle } from 'lucide-react';

interface VideoPreviewProps {
  result: TeaserResult;
  onReset: () => void;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ result, onReset }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      setIsPlaying(false);
      setProgress(0);
    }
  }, [result.videoUrl]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(e => {
          console.error('Unable to play teaser:', e);
          setIsPlaying(false);
        });
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration || 1;
      setProgress((current / duration) * 100);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekPercent = parseFloat(e.target.value);
    if (videoRef.current && videoRef.current.duration) {
      videoRef.current.currentTime = (seekPercent / 100) * videoRef.current.duration;
      setProgress(seekPercent);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(result.videoUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = result.filename || 'generated_teaser.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Clean up the object URL after download starts
      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (error) {
      console.error('Failed to download video:', error);
      // Fallback: trigger opening in a new tab if fetch fails due to CORS or network issues
      const a = document.createElement('a');
      a.href = result.videoUrl;
      a.target = '_blank';
      a.download = result.filename || 'generated_teaser.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', width: '100%' }}>
      {/* Success Badge */}
      <div className="alert-banner alert-info" style={{ width: '100%', justifyContent: 'center' }}>
        <CheckCircle size={18} />
        <span>Teaser successfully generated!</span>
      </div>

      {/* Dedicated 9:16 Teaser Video Player Container */}
      <div className="teaser-container-wrapper">
        <div className="teaser-aspect-box">
          <video
            ref={videoRef}
            src={result.videoUrl}
            className="custom-video-player"
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onVolumeChange={(event) => setIsMuted(event.currentTarget.muted)}
            playsInline
            loop
            controls
          />

          {/* Player Overlay Controls */}
          <div className="player-controls-overlay">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={handleSeek}
              className="seek-slider"
            />

            <div className="controls-row">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button className="control-btn" onClick={togglePlay} title={isPlaying ? 'Pause' : 'Play'}>
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
                <button className="control-btn" onClick={toggleMute} title={isMuted ? 'Unmute' : 'Mute'}>
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
              </div>

              <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)' }}>
                Teaser
              </span>

              <button className="control-btn" onClick={handleFullscreen} title="Fullscreen">
                <Maximize size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
        <button className="btn-primary" onClick={handleDownload}>
          <Download size={18} /> Download Teaser (.mp4)
        </button>
        <button className="btn-secondary" onClick={onReset}>
          <RefreshCw size={18} /> Create Another Teaser
        </button>
      </div>
    </div>
  );
};