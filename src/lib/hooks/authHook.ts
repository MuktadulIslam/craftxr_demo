import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { LoginResponse, LoginCredentials, SignUpResponse, SignUpCredentials, TokenGenerationResponse, TokenGenerationRequest } from '@/types/auth';
import { config } from '@/config';
import { storeAccessToken, storeRefreshToken, removeTokens, getRefreshToken } from '@/utils/authToken';
import { useRouter } from 'next/navigation';
import axiosInstance, { unprotectedAxiosInstance } from '@/config/axios-config';

export const useLogin = () => {
    const router = useRouter();
    let callbackUrl = config.routePaths.dashboard; // Default value

    // Only use searchParams in the browser environment
    if (typeof window !== 'undefined') {
        // Get the URL search params directly from the window object
        const urlSearchParams = new URLSearchParams(window.location.search);
        const paramCallbackUrl = urlSearchParams.get(config.callbackUrlName);
        if (paramCallbackUrl) {
            callbackUrl = paramCallbackUrl;
        }
    }

    return useMutation<LoginResponse, AxiosError, LoginCredentials>({
        mutationFn: async (credentials: LoginCredentials) => {
            const form = new FormData();
            form.append("username", credentials.username);
            form.append("password", credentials.password);

            const { data } = await axios.post<LoginResponse>(
                config.backendBaseURL + config.endpoints.login,
                form
            );
            return data;
        },
        onSuccess: (data) => {
            storeAccessToken(data.access);
            storeRefreshToken(data.refresh);
            router.push(callbackUrl);
            router.refresh();
        },
        onError: () => {
            alert("Incorrect username or password")
        }
    });
};

export const useSignUp = () => {
    return useMutation<number, AxiosError, { credentials: SignUpCredentials; invitationToken: string }, boolean>({
        mutationFn: async ({ credentials, invitationToken }) => {
            const { status, } = await unprotectedAxiosInstance.post(
                config.endpoints.signup(invitationToken),
                credentials
            );
            return status;
        },
        onSuccess: (status) => {
            return true;
        },
        onError: (responsData) => {
            const data = responsData.response?.data as { non_field_errors?: string[] };
            alert(data?.non_field_errors?.[0] || "An error occurred during signup.");  
            return false;
        }
    });
};


export const useLogout = () => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const mutation = useMutation<LoginResponse, AxiosError, void>({
        mutationFn: async () => {
            const form = new FormData();
            const refreshToken = getRefreshToken();
            form.append("refresh", refreshToken || "");
            const { data } = await axios.post(
                config.backendBaseURL + config.endpoints.logout,
                form
            );
            return data;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            console.log('Logging out...', data);
            removeTokens();
            router.push(config.routePaths.login);
            router.refresh();
        },
        onError: (error) => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            console.log('Error logging out...', error);
            // Still attempt to clear local tokens and redirect even if server logout fails
            removeTokens();
            router.push(config.routePaths.login);
            router.refresh();
        }
    });

    return mutation;
};

export const useGenerateAccessToken = () => {
    return useMutation({
        mutationFn: async (data: TokenGenerationRequest): Promise<TokenGenerationResponse> => {
            const { data: responseData } = await axiosInstance.post(
                'https://api.craftxr.io/api/invitation-link/',
                JSON.stringify(data)
            );
            return responseData;
        },
        onSuccess: (responseData) => {
            console.log('Successfully generated access token!', responseData);
        },
        onError: (error) => {
            console.log('Error generating access token!', error);
        }
    });
};
