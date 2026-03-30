import { configureStore as createReduxStore } from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice';
import { authApi } from '../redux/services/authApi';
import { categoryApi } from '@/redux/services/categoryApi';
import { threadApi } from '@/redux/services/threadApi';
import { postApi } from '@/redux/services/postApi';
import { commentApi } from '@/redux/services/commentApi';
export const store = createReduxStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [threadApi.reducerPath]: threadApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [postApi.reducerPath]: postApi.reducer,
        [commentApi.reducerPath]: commentApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(authApi.middleware, threadApi.middleware, categoryApi.middleware, postApi.middleware, commentApi.middleware),
});