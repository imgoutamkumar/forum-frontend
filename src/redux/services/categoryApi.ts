/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
const baseUrl = import.meta.env.VITE_API_BASE_URL;

type ApiResponse<T = unknown> = {
  data: T
  status: string
  message: string
}

export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    tagTypes: ['Category'],
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as any).auth.token

            if (token) {
                headers.set('authorization', `Bearer ${token}`)
            }

            return headers
        },
    }),
    endpoints: (builder) => ({
        createCategory: builder.mutation<ApiResponse, { name: string}>({
            query: (credentials) => ({
                url: '/category/create',
                method: 'POST',
                body: credentials,
            }),
            invalidatesTags: ['Category'],
        }),
        getCategories: builder.query<any, void>({
            query: () => ({
                url: '/category/all',
                method: 'GET',
            }),
            providesTags: ['Category'],
        }),
        deleteCategory: builder.mutation<void, string>({
            query: (id) => ({
                url: `/category/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category'],
        }),
        
    }),
})

export const { useCreateCategoryMutation, useGetCategoriesQuery, useDeleteCategoryMutation } = categoryApi