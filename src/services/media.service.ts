import BaseApiService from "@/api/base";
import { API_ENDPOINTS } from "@/constants";
import type { MediaUploadData, MediaUploadResponse } from "@/types";

class MediaService extends BaseApiService {
  async uploadMedia(file: File, folder = "uploads"): Promise<MediaUploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const url = `${API_ENDPOINTS.MEDIA.UPLOAD}?folder=${encodeURIComponent(folder)}`;

    return this.post<MediaUploadData>(url, formData, {
      withCredentials: false,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export const mediaService = new MediaService();
