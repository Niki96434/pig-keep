import { axiosInstance } from './axiosInstance'
import type {
  Tag,
  TagsGetOut,
  TagGetByIdOut,
  TagCreateIn,
  TagCreateOut,
  TagPutIn,
  TagPatchIn,
  TagUpdateOut,
} from '@shared/tags/types'

export const tagsApi = {
  getTags: async (search?: string): Promise<TagsGetOut> => {
    const res = await axiosInstance.get<TagsGetOut>('/api/v1/tags', {
      params: {
        search: search?.trim() || undefined,
      },
    })
    return res.data
  },

  getTagById: async (id: Tag['id']): Promise<TagGetByIdOut> => {
    const res = await axiosInstance.get<TagGetByIdOut>(`/api/v1/tags/${id}`)
    return res.data
  },

  createTag: async (data: TagCreateIn): Promise<{ tag: TagCreateOut }> => {
    const res = await axiosInstance.post<{ tag: TagCreateOut }>('/api/v1/tags', data)
    return res.data
  },

  updateTag: async (id: Tag['id'], data: TagPutIn): Promise<{ tag: TagUpdateOut }> => {
    const res = await axiosInstance.put<{ tag: TagUpdateOut }>(`/api/v1/tags/${id}`, data)
    return res.data
  },

  patchTag: async (id: Tag['id'], data: TagPatchIn): Promise<{ tag: TagUpdateOut }> => {
    const res = await axiosInstance.patch<{ tag: TagUpdateOut }>(`/api/v1/tags/${id}`, data)
    return res.data
  },

  deleteTag: async (id: Tag['id']): Promise<{ message: string }> => {
    const res = await axiosInstance.delete<{ message: string }>(`/api/v1/tags/${id}`)
    return res.data
  },
}
