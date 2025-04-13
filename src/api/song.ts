import axios from "axios";

const API_URL = "/api/songs";

export const uploadSong = async (
  formData: FormData,
  onUploadProgress?: (progress: number) => void
) => {
  const response = await axios.post('http://localhost:3000/songs/upload', formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress: (progressEvent) => {
      if (onUploadProgress) {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / (progressEvent.total || 1)
        );
        onUploadProgress(percentCompleted);
      }
    },
  });
  return response.data;
};

export const getSongs = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
// empty commit