export interface Song {
  id: number;
  title: string;
  artist: string;
  original_name: string;
  upload_time: string;
}

export interface UploadResponse {
  id: number;
  message: string;
}

export interface UploadProgress {
  percentage: number;
  loaded: number;
  total: number;
}
