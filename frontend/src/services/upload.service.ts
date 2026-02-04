import api from './api';

export const uploadService = {
  /**
   * Upload a single image file
   * @param file - The image file to upload
   * @returns The URL of the uploaded image
   */
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await api.post('/products/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Backend should return the uploaded file URL
    return response.data.imageUrl || response.data.url || response.data.file?.path;
  },
};
