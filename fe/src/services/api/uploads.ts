import apiClient from './client'
import { unwrapResponseData } from './response'

export const uploadsApi = {
  async uploadImage(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiClient.post('/uploads/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
    })
    const data = unwrapResponseData<{ url: string }>(response)
    return data.url
  },

  async uploadImages(files: File[]): Promise<string[]> {
    const formData = new FormData()
    for (const file of files) {
      formData.append('files', file)
    }
    const response = await apiClient.post('/uploads/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
    })
    const data = unwrapResponseData<{ urls: string[] }>(response)
    return data.urls
  },
}
