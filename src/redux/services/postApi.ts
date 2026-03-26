/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { ApiResponse, PostPaginatedResponse, PostWithBlocks } from '../types/thread'

export const postApi = createApi({
    reducerPath: "postApi",
    tagTypes: ["Posts"],
    baseQuery: fetchBaseQuery({
        baseUrl: "https://forum-backend-5pxg.onrender.com/",
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as { auth?: { token?: string } }).auth?.token

            if (token) {
                headers.set("authorization", `Bearer ${token}`)
            }

            return headers
        },
    }),
    endpoints: (builder) => ({
        createPost: builder.mutation<ApiResponse, FormData>({
            query: (formData) => {
                return {
                    url: "/posts/create",
                    method: "POST",
                    body: formData,
                }
            },

            invalidatesTags: [{ type: "Posts", id: "LIST" }],
        }),

        getThreadPosts: builder.query<PostPaginatedResponse<PostWithBlocks>, { threadId: string; page: number; limit: number }>({
            query: ({ threadId, page, limit }) => ({
                url: `/posts/thread/${threadId}`,
                method: "GET",
                params: { page, limit },
            }),
        }),

        reorderPostBlockImages: builder.mutation({
            query: (data) => ({
                url: '/reorder-images',
                method: 'POST',
                body: data,
            }),
        }),

    }),
})

export const {
    useCreatePostMutation,
    useGetThreadPostsQuery,
    useReorderPostBlockImagesMutation
} = postApi