'use client'
import { setLoaclStorageSavingState, setRemoveLoaclStorageState } from "@/lib/redux/features/localStorageSavingSlice";
import { deleteNewSimulationStoredData } from "@/lib/redux/LocalStorageContext";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";

export default function LocalStorageSave() {
    const dispatch = useAppDispatch();
    const { isSaving } = useAppSelector(state => state.localStorageState);
    const deleteSimulationStoredData = () => {
        dispatch(setLoaclStorageSavingState(true));
        
        deleteNewSimulationStoredData();
        // Dispatch Redux action to notify components that localStorage was cleared
        dispatch(setRemoveLoaclStorageState(true));

        // Reset saving state after a short delay
        setTimeout(() => {
            dispatch(setLoaclStorageSavingState(false));
            // Reset the remove state after components have had a chance to react
            setTimeout(() => {
                dispatch(setRemoveLoaclStorageState(false));
            }, 100);
        }, 500);
    }
    return (<>
        <div className="w-auto h-auto flex justify-center items-center gap-5">
            <div className="w-24 h-10 flex items-center">
                <div className={`mr-3 w-3 aspect-square rounded-full ${isSaving ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                <span className="text-sm text-gray-600">
                    {isSaving ? 'Saving...' : `Saved`}
                </span>
            </div>

            <button
                onClick={() => { deleteSimulationStoredData() }}
                className="bg-red-500 px-4 py-1 rounded-lg text-white flex items-center gap-1 hover:bg-red-700 transition-colors duration-200 ease-in-out"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
                    <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                </svg>
                Remove Saved
            </button>
        </div>
    </>)
}