"use client"

import { useGetUserProfile } from "@/lib/hooks/profileHook";
import { setUser } from "@/lib/redux/features/auth/authSlice";
import { RootState } from "@/lib/redux/store";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function UserDataLoader(){
    const { data: profile, refetch } = useGetUserProfile();
    const { user } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch();
    useEffect(() => {
        // Only dispatch setUser when profile data is available
        if (!user && profile) {
            dispatch(setUser(profile));
        }
    }, [dispatch, user, profile]);

    // Trigger refetch on initial load
    useEffect(() => {
        if (!user) {
            refetch();
        }
    }, [refetch, user]);
    return (<></>)
}