import React from 'react';
import { TeaserResult } from '../types/teaser';
import { Download, RefreshCw, CheckCircle } from 'lucide-react';

interface VideoPreviewProps {
  result: TeaserResult;
  onReset: () => void;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({ result, onReset }) => {
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
            src={result.videoUrl}
            className="custom-video-player"
            playsInline
            loop
            controls
          />
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