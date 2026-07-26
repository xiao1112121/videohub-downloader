import { useDownloadStore } from '@/lib/store';
import { downloadVideoService } from '@/services/api';
import { DownloadResponse } from '@/types';

interface UseDownloadReturn {
  isLoading: boolean;
  error: string | null;
  data: DownloadResponse | null;
  download: (url: string) => Promise<boolean>;
  reset: () => void;
}

export const useDownload = (): UseDownloadReturn => {
  const { isLoading, error, data, setLoading, setError, setData, reset } = useDownloadStore();

  const download = async (url: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);
      const result = await downloadVideoService.download(url);
      setData(result);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to download video';
      setError(message);
      setData(null);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { isLoading, error, data, download, reset };
};
