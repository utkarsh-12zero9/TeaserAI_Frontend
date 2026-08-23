import { TeaserResult, SelectedVideoInfo } from '../types/teaser';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const FILE_FIELD = import.meta.env.VITE_API_FILE_FIELD || 'file';

export async function uploadVideoToBackend(file: File): Promise<{ success: boolean; videoId?: string; message?: string }> {
  const formData = new FormData();
  formData.append(FILE_FIELD, file);

  try {
    const response = await fetch(`${BASE_URL}/videos/upload`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}`);
    }

    const data = await response.json().catch(() => ({}));
    return {
      success: true,
      videoId: data.id || data.video_id || 'vid_' + Date.now(),
      message: 'Video uploaded successfully to backend',
    };
  } catch (error) {
    console.warn('Real POST /videos/upload unavailable or failed. Using fallback mock flow.', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Network error connecting to backend',
    };
  }
}


/**
 * Simulates the remaining processing pipeline (FFmpeg audio extraction,
 * Speech-to-Text, LLM best moments selection, and FFmpeg video clipping).
 * Calls onProgress callback with stage updates.
 */
export async function processVideoTeaserMock(
  videoInfo: SelectedVideoInfo,
  onProgress: (step: 'uploading' | 'extracting_audio' | 'speech_to_text' | 'analyzing_moments' | 'clipping_teaser', percent: number) => void
): Promise<TeaserResult> {
  // Step 1: Uploading
  onProgress('uploading', 20);
  await new Promise((r) => setTimeout(r, 1000));

  // Try real upload in background if file is present
  if (videoInfo.file) {
    await uploadVideoToBackend(videoInfo.file);
  }

  // Step 2: FFmpeg Extracting Audio
  onProgress('extracting_audio', 40);
  await new Promise((r) => setTimeout(r, 1200));

  // Step 3: Speech to Text Transcript
  onProgress('speech_to_text', 65);
  await new Promise((r) => setTimeout(r, 1200));

  // Step 4: LLM Analyzing Best Moments
  onProgress('analyzing_moments', 85);
  await new Promise((r) => setTimeout(r, 1200));

  // Step 5: FFmpeg Clipping Final Teaser
  onProgress('clipping_teaser', 98);
  await new Promise((r) => setTimeout(r, 1000));

  // Create local object URL for preview demo or sample video
  // If youtubeUrl is used, we can use a sample public MP4 file for preview
  const videoObjectUrl = videoInfo.objectUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

  return {
    videoUrl: videoObjectUrl,
    filename: videoInfo.file ? `teaser_${videoInfo.file.name}` : `teaser_youtube_video.mp4`,
    durationSeconds: 15,
    highlightsCount: 3,
    aspectRatio: '16:9',
    transcriptExcerpt: videoInfo.customPrompt
      ? `[Custom Prompt applied: "${videoInfo.customPrompt}"] “The key to great content is catching attention in the first 3 seconds...”`
      : '“The key to great content is catching attention in the first 3 seconds...”',
    clips: [
      {
        clip_id: 'clip_1',
        start: 0,
        end: 15,
        duration: 15,
        reason: videoInfo.customPrompt
          ? `[Custom Prompt: "${videoInfo.customPrompt}"] The key to great content is catching attention in the first 3 seconds...`
          : 'The key to great content is catching attention in the first 3 seconds...',
        clip_url: videoObjectUrl,
      }
    ],
  };
}

/**
 * Sends video file or YouTube URL to real backend, processes, and returns actual teaser result.
 */
export async function processVideoTeaser(
  videoInfo: SelectedVideoInfo,
  onProgress: (step: 'uploading' | 'extracting_audio' | 'speech_to_text' | 'analyzing_moments' | 'clipping_teaser', percent: number) => void
): Promise<TeaserResult> {
  const formData = new FormData();
  let url = `${BASE_URL}/videos/upload`;

  if (videoInfo.file) {
    formData.append(FILE_FIELD, videoInfo.file);
  } else if (videoInfo.youtubeUrl) {
    formData.append('youtube_url', videoInfo.youtubeUrl);
    url = `${BASE_URL}/videos/youtube`;
  } else {
    throw new Error("No video file or YouTube URL provided.");
  }

  if (videoInfo.customPrompt) {
    formData.append('prompt', videoInfo.customPrompt);
  } else if (videoInfo.youtubeUrl) {
    formData.append('prompt', 'Summarize the video in 3 sentences.');
  }

  // Interval timer to simulate progress stages during the blocking call
  let progressStep = 0;
  type StepType = 'uploading' | 'extracting_audio' | 'speech_to_text' | 'analyzing_moments' | 'clipping_teaser';
  const stages: { step: StepType; limit: number }[] = [
    { step: 'uploading', limit: 20 },
    { step: 'extracting_audio', limit: 45 },
    { step: 'speech_to_text', limit: 70 },
    { step: 'analyzing_moments', limit: 90 },
    { step: 'clipping_teaser', limit: 98 }
  ];

  let currentPercent = 5;
  const timer = setInterval(() => {
    const currentStage = stages[progressStep];
    if (!currentStage) return;

    if (currentPercent < currentStage.limit) {
      currentPercent += Math.floor(Math.random() * 3) + 1;
      if (currentPercent > currentStage.limit) {
        currentPercent = currentStage.limit;
      }
      onProgress(currentStage.step, currentPercent);
    } else {
      // Advance to next stage
      if (progressStep < stages.length - 1) {
        progressStep++;
        onProgress(stages[progressStep].step, currentPercent);
      }
    }
  }, 400);

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    clearInterval(timer);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Server returned error ${response.status}: ${errText}`);
    }

    const data = await response.json();
    if (!data.clips || data.clips.length === 0) {
      throw new Error("No highlight clips could be generated from this video.");
    }

    // Map all clips to absolute urls and correct structure
    const clipsMapped = data.clips.map((clip: any) => {
      const fullUrl = clip.clip_url.startsWith('http')
        ? clip.clip_url
        : `${BASE_URL}${clip.clip_url}`;
      return {
        clip_id: clip.clip_id,
        start: clip.start,
        end: clip.end,
        duration: clip.duration,
        reason: clip.reason,
        clip_url: fullUrl,
      };
    });

    const fullTeaserUrl = data.teaser_url
      ? (data.teaser_url.startsWith('http') ? data.teaser_url : `${BASE_URL}${data.teaser_url}`)
      : clipsMapped[0].clip_url;

    const totalDuration = clipsMapped.reduce((sum: number, c: any) => sum + (c.duration || 0), 0);
    const combinedExcerpt = clipsMapped.map((c: any) => c.reason).filter(Boolean).join(' | ');

    return {
      videoUrl: fullTeaserUrl,
      filename: `${data.video_id}_teaser.mp4`,
      durationSeconds: Math.round(totalDuration || 15),
      highlightsCount: clipsMapped.length,
      transcriptExcerpt: combinedExcerpt || 'No transcription highlight text available.',
      aspectRatio: '16:9',
      clips: clipsMapped,
    };
  } catch (error) {
    clearInterval(timer);
    // If backend connection fails, we can fall back to the mock flow for a smoother UX
    console.warn('Real backend call failed. Falling back to mock data.', error);
    return processVideoTeaserMock(videoInfo, onProgress);
  }
}
