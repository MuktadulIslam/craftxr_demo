import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LocalStorageSavingState {
    isSaving: boolean;
    isLocalStorageRemoved: boolean;
}

const initialState: LocalStorageSavingState = {
    isSaving: false,
    isLocalStorageRemoved: false
};

export const localStorageSavingSlice = createSlice({
    name: 'local-storage-saving-state',
    initialState,
    reducers: {
        setLoaclStorageSavingState: (state, action: PayloadAction<boolean>) => {
            state.isSaving = action.payload;
        },
        setRemoveLoaclStorageState: (state, action: PayloadAction<boolean>) => {
            state.isLocalStorageRemoved = action.payload;
        }
    }
});

export const { setLoaclStorageSavingState, setRemoveLoaclStorageState } = localStorageSavingSlice.actions;
export default localStorageSavingSlice.reducer;