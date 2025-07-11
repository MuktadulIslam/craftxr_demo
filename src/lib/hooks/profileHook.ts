import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/config/axios-config';
import { config } from '@/config';
import { UserProfile } from '@/types/user';
import { getRefreshToken } from '@/utils/authToken';
import {config as AppConfig} from '@/config';


export const useGetUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: async (): Promise<UserProfile> => {
      const { data } = await axiosInstance.get(config.endpoints.userData);
      return data;
    },
    enabled: !!getRefreshToken(), // Only run if refresh token exists
    staleTime: AppConfig.token.refreshTokenExpiry,
  });
};