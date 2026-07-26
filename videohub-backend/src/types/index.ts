// Video quality format
export interface VideoQuality {
  name: string;
  url: string;
}

// Download response
export interface DownloadResponse {
  title: string;
  thumbnail: string;
  duration: string;
  quality: VideoQuality[];
  platform: 'tiktok' | 'facebook' | 'youtube';
}

// Request body
export interface DownloadRequest {
  url: string;
}

// Statistics
export interface Statistics {
  todayDownloads: number;
  totalDownloads: number;
  tiktokDownloads: number;
  facebookDownloads: number;
  youtubeDownloads: number;
}

// Cache data
export interface CacheData {
  data: DownloadResponse;
  timestamp: number;
}
