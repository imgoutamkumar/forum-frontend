import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from '../slices/authSlice';
const baseUrl = import.meta.env.VITE_API_BASE_URL;


const rawBaseQuery = fetchBaseQuery({
  baseUrl: baseUrl,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');

    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  },
});

export const baseQueryWithAuth = async (args : any, api: any, extraOptions: any) => {
//   const token = localStorage.getItem('token');

  // Check expiry before request
//   if (token && isTokenExpired(token)) {
//     logout();
//     return { error: { status: 401, data: 'Token expired' } };
//   }

  const result = await rawBaseQuery(args, api, extraOptions);

  // Handle backend rejection
  if (result.error?.status === 401) {
    // logout();
       api.dispatch(logout());
  }

  return result;
};