import { useQuery } from '@tanstack/react-query';
import axiosInstance from '@/config/axios-config';
import { config } from '@/config';
import { GetEvaluationResponse, GetEvaluationsResponse } from '@/types/evaluations';

export const useGetEvaluations = (pageNumber: number) => {
    return useQuery({
        queryKey: [`getEvaluations-${pageNumber}`],
        queryFn: async (): Promise<GetEvaluationsResponse> => {
            const { data } = await axiosInstance.get(config.endpoints.evaluations(config.evalutionOffsetLimit, pageNumber*config.evalutionOffsetLimit));
            return data;
        },
    });
};

export const useGetEvaluation = (evaluationID: string) => {
    return useQuery({
        queryKey: [`getEvaluation-${evaluationID}`],
        queryFn: async (): Promise<GetEvaluationResponse> => {
            const { data } = await axiosInstance.get(config.endpoints.evaluation(evaluationID));
            return data;
        },
        // Only run this query if we have a simulation ID
        enabled: !!evaluationID,
    });
};