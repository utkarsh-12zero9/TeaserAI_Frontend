export type ProcessingStatus =
  | 'INITIAL'
  | 'VIDEO_SELECTED'
  | 'UPLOADING'
  | 'PROCESSING'
  | 'SUCCESS'
  | 'ERROR';

export type PipelineStep =
  | 'idle'
  | 'uploading'
  | 'extracting_audio'
  | 'speech_to_text'
  | 'analyzing_moments'
  | 'clipping_teaser'
  | 'complete';

export interface SelectedVideoInfo {
  file?: File;
  youtubeUrl?: string;
  name: string;
  sizeFormatted?: string;
  duration?: number;
  objectUrl?: string;
  customPrompt?: string;
}

export interface TeaserClip {
  clip_id: string;
  start: number;
  end: number;
  duration: number;
  reason: string;
  clip_url: string;
}

export interface TeaserResult {
  videoUrl: string;
  filename: string;
  durationSeconds: number;
  highlightsCount: number;
  transcriptExcerpt?: string;
  aspectRatio: string; // e.g. "9:16"
  clips: TeaserClip[];
}

export interface ApiError {
  message: string;
  code?: string;
}
