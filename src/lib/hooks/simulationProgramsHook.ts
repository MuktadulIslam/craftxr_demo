import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/config/axios-config';
import { config } from '@/config';
import {Program, ProgramListResponse} from '@/types/programAffiliation'

export const useGetProgramAffiliations = () => {
    return useQuery({
        queryKey: ['program-affiliations'],
        queryFn: async (): Promise<ProgramListResponse> => {
            const { data } = await axiosInstance.get(config.endpoints.programs);
            return data;
        },
    });
};

export const useCreateProgram = () => {
    return useMutation({
        mutationFn: async (data: Program): Promise<number> => {
            const { status } = await axiosInstance.post(
                config.endpoints.programs,
                JSON.stringify(data)
            );
            return status;
        },
        onSuccess: (status) => {
            alert('Successfully created the program!');
        },
        onError: (error: any) => {
            if(error?.response?.status === 400) {
                alert('Program already exists! Use a different name or abbreviation.');
            }
            else{
                alert('Selected Institute/School does not exist!');
            }
        }
    });
};



export const useDeleteProgram = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ programID, pageNumber }: { programID: string, pageNumber: number }): Promise<{ programID: string }> => {
            await axiosInstance.delete(
                config.endpoints.program(programID)
            );
            return { programID };
        },
        onSuccess: ({ programID }, variables) => {
            console.log('Successfully deleted the program!');

            // Invalidate the getSimulations query to refetch the updated list
            queryClient.invalidateQueries({ queryKey: [`program-affiliations`] });
        },
        onError: (error) => {
            console.log('Error deleting the program!', error);
        }
    });
};