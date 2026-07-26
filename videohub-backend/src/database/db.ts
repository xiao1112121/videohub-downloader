// In-memory database for statistics and logging
// For production, replace with MongoDB/PostgreSQL

interface DownloadLog {
  id: string;
  url: string;
  platform: string;
  timestamp: number;
  ipAddress: string;
}

interface Stats {
  todayDownloads: number;
  totalDownloads: number;
  tiktokDownloads: number;
  facebookDownloads: number;
  youtubeDownloads: number;
  lastReset: number;
}

class Database {
  private logs: DownloadLog[] = [];
  private stats: Stats = {
    todayDownloads: 0,
    totalDownloads: 0,
    tiktokDownloads: 0,
    facebookDownloads: 0,
    youtubeDownloads: 0,
    lastReset: Date.now(),
  };

  // Log download
  logDownload(url: string, platform: string, ipAddress: string) {
    const log: DownloadLog = {
      id: Date.now().toString(),
      url,
      platform,
      timestamp: Date.now(),
      ipAddress,
    };

    this.logs.push(log);

    // Update stats
    this.stats.totalDownloads++;
    this.stats.todayDownloads++;

    switch (platform) {
      case 'tiktok':
        this.stats.tiktokDownloads++;
        break;
      case 'facebook':
        this.stats.facebookDownloads++;
        break;
      case 'youtube':
        this.stats.youtubeDownloads++;
        break;
    }

    // Reset daily stats at midnight
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (this.stats.lastReset < today.getTime()) {
      this.stats.todayDownloads = 1;
      this.stats.lastReset = today.getTime();
    }

    return log;
  }

  // Get statistics
  getStats() {
    return { ...this.stats };
  }

  // Get logs
  getLogs(limit: number = 100) {
    return this.logs.slice(-limit);
  }
}

export const db = new Database();
