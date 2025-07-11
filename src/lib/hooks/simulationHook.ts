import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '@/config/axios-config';
import { config } from '@/config';
import { Simulation, SimulationsResponse, ScenarioUpdateFormData, SimulationCreateRequest } from '@/types/simulations';
import { RawScenarioChat, ScenarioChatUpdateFormData, SimulationChatTreeType, SimulationChatType } from '@/types/simulationChat';


// interface DeleteSimulationResponse {
//     result: string;
//     deleted_simulation: [
//         number,
//         {
//             [key: string]: number;
//         }
//     ];
// }

interface CreateSimulationResponse {
    simulation_id: string
}

// interface UpdateSimulationChatResponse {
//     result: string
// }

// interface UpdateSimulationResponse {
//     result: string
// }


export const useGetSimulations = (pageNumber: number) => {
    return useQuery({
        queryKey: [`getSimulations-${pageNumber}`],
        queryFn: async (): Promise<SimulationsResponse> => {
            const { data } = await axiosInstance.get(config.endpoints.simulationsByLimits(config.simulationOffsetLimit, pageNumber * config.simulationOffsetLimit));
            return data;
        },
    });
};

export const useGetSimulation = (simulationID: string) => {
    return useQuery({
        queryKey: [`getSimulation-${simulationID}`],
        queryFn: async (): Promise<Simulation> => {
            const { data } = await axiosInstance.get(config.endpoints.simulation(simulationID));
            return data;
        },
        // Only run this query if we have a simulation ID
        enabled: !!simulationID,
    });
};

export const useGetSimulationChat = (simulationID: string) => {
    return useQuery({
        queryKey: [`getChat-${simulationID}`],
        queryFn: async (): Promise<SimulationChatTreeType> => {
            const { data } = await axiosInstance.get(config.endpoints.simulationChats(simulationID));
            return data;
        },
        // Only run this query if we have a simulation ID
        enabled: !!simulationID,
    });
};



export const useUpdateSimulation = (simulationID: string) => {
    return useMutation({
        mutationFn: async (data: ScenarioUpdateFormData) => {
            await axiosInstance.patch(
                config.endpoints.simulation(simulationID),
                JSON.stringify(data)
            );
        },
        onSuccess: () => {
            console.log('Successfully updated the simulation!');
        },
        onError: (error) => {
            console.log('Error updating the simulation!', error);
        }
    });
};

export const useUpdateSimulationChat = () => {
    return useMutation({
        mutationFn: async ({ chatData, simulationChatID }:
            {
                chatData: ScenarioChatUpdateFormData,
                simulationChatID: string
            }) => {
            await axiosInstance.patch(
                config.endpoints.updateSimulationChats(simulationChatID),
                JSON.stringify(chatData)
            );
        },
        onSuccess: () => {
            console.log('Successfully updated the simulation chat!');
        },
        onError: (error) => {
            console.log('Error updating the simulation chat!', error);
        }
    });
};


export const useCreateSimulation = () => {
    return useMutation({
        mutationFn: async (data: SimulationCreateRequest): Promise<CreateSimulationResponse> => {
            const { data: responseData } = await axiosInstance.post(
                config.endpoints.simulations,
                JSON.stringify(data)
            );
            return responseData
        },
        onSuccess: (responseData) => {
            console.log('Successfully created the simulation!', responseData);
        },
        onError: (error) => {
            console.log('Error updating the simulation!', error);
        }
    });
};



export const useDeleteSimulation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ simulationID, pageNumber }: { simulationID: string, pageNumber: number }): Promise<{ simulationID: string }> => {
            await axiosInstance.delete(
                config.endpoints.simulation(simulationID)
            );
            return { simulationID };
        },
        onSuccess: ({ simulationID }, variables) => {
            console.log('Successfully deleted the simulation!');

            // Invalidate the getSimulations query to refetch the updated list
            queryClient.invalidateQueries({ queryKey: [`getSimulations-${variables.pageNumber}`] });

            // Additionally, remove the specific simulation query if it exists
            queryClient.removeQueries({ queryKey: [`getSimulation-${simulationID}`] });
        },
        onError: (error) => {
            console.log('Error deleting the simulation!', error);
        }
    });
};



const convertSimulationChatToRawScenarioChat = (
    simulationChat: SimulationChatType
): RawScenarioChat => {
    const chatLevelNumber = parseInt(simulationChat.chat_level.substring(1), 10);

    return {
        chat: {
            dialog: simulationChat.chat.dialog,
            intent: simulationChat.chat.intent,
            topic: simulationChat.chat.topic
        },
        chat_level: chatLevelNumber,
        speaker: simulationChat.speaker,
        outcome_state: simulationChat.outcome_state ? simulationChat.outcome_state : 'N',
        // Recursively convert subchat items
        subchat: simulationChat.subchat.map(convertSimulationChatToRawScenarioChat)
    };
}



export const useDuplicateSimulation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (simulationID: string): Promise<CreateSimulationResponse> => {
            // Make both API calls concurrently using Promise.all
            const [simulationInfoResponse, simulationChatResponse] = await Promise.all([
                axiosInstance.get<Simulation>(config.endpoints.simulation(simulationID)),
                axiosInstance.get<SimulationChatTreeType>(config.endpoints.simulationChats(simulationID))
            ]);

            const existingSimulationInfo = simulationInfoResponse.data;
            const existingSimulationChat = simulationChatResponse.data;

            const newSimulationData: SimulationCreateRequest = {
                program_affiliation: existingSimulationInfo.affiliation.affiliation_id,
                scenario_name: existingSimulationInfo.scenario.scenario_name,
                scenario_overview: existingSimulationInfo.scenario.scenario_overview,
                scenario_description: existingSimulationInfo.scenario.scenario_description,
                scenario_related_details: existingSimulationInfo.scenario.scenario_details,
                simulation_title: existingSimulationInfo.simulation_title + " (Copy)",
                simulation_description: existingSimulationInfo.simulation_description,
                simulation_objectives: existingSimulationInfo.simulation_objectives,
                avatar_designation: existingSimulationInfo.avatar_designation,
                show_evaluation_panel: true,
                chats: convertSimulationChatToRawScenarioChat(existingSimulationChat[0]),
            }
            console.log("make request for creating new simulation...")
            const { data: responseData } = await axiosInstance.post(
                config.endpoints.simulations,
                JSON.stringify(newSimulationData)
            );
            console.log("got response for creating new simulation...")

            return responseData;
        },
        onSuccess: (responseData) => {
            console.log('Successfully duplicated the simulation!', responseData);
            // Invalidate the getSimulations query to refetch the updated list
            queryClient.invalidateQueries({ queryKey: ['getSimulations'] });
        },
        onError: (error) => {
            console.log('Error duplicating the simulation!', error);
        }
    });
};
