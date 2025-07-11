import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/config/axios-config';
import { config } from '@/config';
import { SimulationSceneConfig } from '@/types/simulationScene';
import {AssetConfigurationData} from '@/types/simulationAssets'

export const useGetSceneConfig = () => {
    return useQuery({
        queryKey: ['getSceneConfig'],
        queryFn: async (): Promise<SimulationSceneConfig> => {
            const { data } = await axiosInstance.get(config.endpoints.simulationSceneConfig);
            return data;
        }
    });
};

export const useGetAssetsConfig = () => {
    return useQuery({
        queryKey: ['getAssetsConfig'],
        queryFn: async (): Promise<AssetConfigurationData> => {
            const { data } = await axiosInstance.get(config.endpoints.simulationAssetsConfig);
            return data;
        }
    });
};