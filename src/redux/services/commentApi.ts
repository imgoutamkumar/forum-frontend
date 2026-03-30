/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi} from '@reduxjs/toolkit/query/react'
import { baseQueryWithAuth } from './baseQuery';

type ApiResponse<T = unknown> = {
  data: T
  status: string
  message: string
}

export const commentApi = createApi({
    reducerPath: 'commentApi',
    tagTypes: ['Comment'],
    baseQuery:baseQueryWithAuth,
    endpoints: (builder) => ({
        createComment: builder.mutation<ApiResponse, { content: string; postId: string }>({
            query: (credentials) => ({
                url: 'comments/create',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Comment'],
        }),
        getComments: builder.query<any, any>({
            query: (postId) => ({
                url: `comments/post/${postId}`,
                method: 'GET',
            }),
            providesTags: ['Comment'],
        }),
        deleteComment: builder.mutation<void, string>({
            query: (commentId) => ({
                url: `comments/${commentId}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Comment'],
        }),
        
    }),
})

export const { useCreateCommentMutation, useLazyGetCommentsQuery , useDeleteCommentMutation } = commentApi