import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice"
import { apiSlice } from "../api/apiSlice";


export const store = configureStore({
    reducer: {
        api: apiSlice.reducer,
        user: userReducer

    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware)


})

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;