/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi} from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from './baseQuery';

type ApiResponse<T = unknown> = {
  data: T
  status: string
  message: string
}

export const replyApi = createApi({
    reducerPath: 'replyApi',
    tagTypes: ['Reply'],
    baseQuery:baseQueryWithAuth,
    endpoints: (builder) => ({
        createReply: builder.mutation<ApiResponse, { content: string; commentId: string }>({
            query: (credentials) => ({
                url: 'replies/create',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Reply'],
        }),
        getReplies: builder.query<any, any>({
            query: (commentId) => ({
                url: `replies/comment/${commentId}`,
                method: 'GET',
            }),
            providesTags: ['Reply'],
        }),
        deleteReply: builder.mutation<void, string>({
            query: (commentId) => ({
                url: `replies/${commentId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Reply'],
        }),
        
    }),
})

export const { useCreateReplyMutation, useLazyGetRepliesQuery , useDeleteReplyMutation } = replyApi