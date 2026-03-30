/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { ApiResponse, PostPaginatedResponse, PostWithBlocks } from '../types/thread'
import { baseQueryWithAuth } from './baseQuery';
const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const postApi = createApi({
    reducerPath: "postApi",
    tagTypes: ["Posts"],
    // baseQuery: fetchBaseQuery({
    //     baseUrl: baseUrl,
    //     prepareHeaders: (headers, { getState }) => {
    //         const token = (getState() as { auth?: { token?: string } }).auth?.token

    //         if (token) {
    //             headers.set("authorization", `Bearer ${token}`)
    //         }

    //         return headers
    //     },
    // }),
    baseQuery:baseQueryWithAuth,
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
            providesTags: (result, error, { threadId }) => {
                if (!result) {
                    return [{ type: "Posts", id: `THREAD_${threadId}` }]
                }

                return [
                    { type: "Posts", id: `THREAD_${threadId}` },
                    ...result.data.posts.map((post) => ({
                        type: "Posts" as const,
                        id: post.id,
                    })),
                ]
            }
        }),

        updatePost: builder.mutation<ApiResponse, { threadId: string; formData: FormData }>({
            query: ({ threadId, formData }) => {
                return {
                    url: `/posts/update/${threadId}`,
                    method: "PUT",
                    body: formData,
                }
            },
            invalidatesTags: (result, error, { threadId}) => [
                { type: "Posts", id: `THREAD_${threadId}` },
            ],
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
    useUpdatePostMutation,
    useReorderPostBlockImagesMutation
} = postApi