import { useQuery } from '@tanstack/react-query';
import axiosInstance, { unprotectedAxiosInstance } from '@/config/axios-config';
import { config } from '@/config';
import { Department, Institute, School } from '@/types/instituteService';

export const useGetDepartments = () => {
    return useQuery({
        queryKey: [`getDepartments`],
        queryFn: async (): Promise<Department[]> => {
            const { data } = await unprotectedAxiosInstance.get(config.endpoints.departments);
            return data;
        },
    });
};

export const useGetInstitutes = () => {
    return useQuery({
        queryKey: [`getInstitutes`],
        queryFn: async (): Promise<Institute[]> => {
            const { data } = await axiosInstance.get(config.endpoints.institutes);
            return data;
        },
    });
};

export const useGetSchool = () => {
    return useQuery({
        queryKey: [`getSchool`],
        queryFn: async (): Promise<School[]> => {
            const { data } = await axiosInstance.get(config.endpoints.schools);
            return data;
        },
    });
};