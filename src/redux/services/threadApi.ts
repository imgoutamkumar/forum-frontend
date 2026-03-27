import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { ApiResponse, CreateThreadPayload, Thread, ThreadPaginatedResponse } from "../types/thread"

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export const threadApi = createApi({
    reducerPath: "threadApi",
    tagTypes: ["Threads"],
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as { auth?: { token?: string } }).auth?.token

            if (token) {
                headers.set("authorization", `Bearer ${token}`)
            }

            return headers
        },
    }),

    endpoints: (builder) => ({

        /* ===== CREATE THREAD ===== */
        createThread: builder.mutation<ApiResponse, FormData>({
            query: (formData) => {
                return {
                    url: "/threads/create",
                    method: "POST",
                    body: formData,
                }
            },

            invalidatesTags: [{ type: "Threads", id: "LIST" }],
        }),

        getThreads: builder.query<ThreadPaginatedResponse<Thread>, { page?: number; limit?: number }>({
            query: (params) => ({
                url: "/threads",
                method: "GET",
                params,
            }),

            providesTags: (result) =>
                result?.data
                    ? [
                        { type: "Threads", id: "LIST" },
                        ...result.data.threads.map((thread) => ({
                            type: "Threads" as const,
                            id: thread.id,
                        })),
                    ]
                    : [{ type: "Threads", id: "LIST" }],
        }),

        getThreadById: builder.query<ApiResponse<Thread>, string>({
            query: (id) => ({
                url: `/threads/${id}`,
                method: "GET",
            }),
            providesTags: (result, error, id) => [
                { type: "Threads", id },
            ],
        }),

        updateThread: builder.mutation<ApiResponse<Thread>, { id: string; data: CreateThreadPayload }>({
            query: ({ id, data }) => {
                const formData = new FormData()

                formData.append("title", data.title)
                formData.append("categoryId", data.categoryId)

                data.post.blocks.forEach((block, index) => {
                    formData.append(`blocks[${index}][type]`, block.type)

                    if (block.content) {
                        formData.append(`blocks[${index}][content]`, block.content)
                    }

                    if (block.media instanceof File) {
                        formData.append(`blocks[${index}][media]`, block.media)
                    } else if (typeof block.media === "string") {
                        formData.append(`blocks[${index}][mediaUrl]`, block.media)
                    }
                })

                return {
                    url: `/threads/${id}`,
                    method: "PUT",
                    body: formData,
                }
            },
            invalidatesTags: (result, error, { id }) => [
                { type: "Threads", id },
                { type: "Threads", id: "LIST" },
            ],
        }),

        deleteThread: builder.mutation<ApiResponse<null>, string>({
            query: (id) => ({
                url: `/threads/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (result, error, id) => [
                { type: "Threads", id },
                { type: "Threads", id: "LIST" },
            ],
        }),
    }),
})

export const {
    useGetThreadsQuery,
    useGetThreadByIdQuery,
    useCreateThreadMutation,
    useUpdateThreadMutation,
    useDeleteThreadMutation,
} = threadApi