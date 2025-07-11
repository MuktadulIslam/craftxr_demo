import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/auth/authSlice';
import loaclStorageSavingReducer from './features/localStorageSavingSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    localStorageState: loaclStorageSavingReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


// Redux Hooks
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;