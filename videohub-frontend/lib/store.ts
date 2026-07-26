import { create } from 'zustand';
import { DownloadState, DownloadResponse } from '@/types';

interface DownloadStore {
  isLoading: boolean;
  error: string | null;
  data: DownloadResponse | null;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setData: (data: DownloadResponse | null) => void;
  reset: () => void;
}

export const useDownloadStore = create<DownloadStore>((set) => ({
  isLoading: false,
  error: null,
  data: null,
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  setData: (data: DownloadResponse | null) => set({ data }),
  reset: () => set({ isLoading: false, error: null, data: null }),
}));
