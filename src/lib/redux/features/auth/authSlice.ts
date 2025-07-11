import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from '@/types/auth';
import { UserProfile } from '@/types/user';

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserProfile>) => {
            state.user = {...(state.user || {}), ...action.payload};
            state.isAuthenticated = true;
        },
        clearUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        },
    },
});

export const { setUser, clearUser } = userSlice.actions;

export default userSlice.reducer;
