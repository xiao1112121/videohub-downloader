// Video quality format
export interface VideoQuality {
  name: string;
  url: string;
}

// Download response from API
export interface DownloadResponse {
  title: string;
  thumbnail: string;
  duration: string;
  quality: VideoQuality[];
  platform: 'tiktok' | 'facebook' | 'youtube';
}

// Video metadata
export interface VideoMetadata {
  title: string;
  thumbnail: string;
  duration: string;
  resolution?: string;
  source: string;
}

// Download state
export interface DownloadState {
  isLoading: boolean;
  error: string | null;
  data: DownloadResponse | null;
}

// Platform type
export type Platform = 'tiktok' | 'facebook' | 'youtube';

// Stats type
export interface Stats {
  todayDownloads: number;
  totalDownloads: number;
  tiktokDownloads: number;
  facebookDownloads: number;
  youtubeDownloads: number;
}
