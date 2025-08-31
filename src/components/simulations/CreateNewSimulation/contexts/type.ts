import { DialogFlowEdge, DialogFlowNode } from '@/components/reactflow/types';
import { SimulationBasicInfoForm } from '@/types/simulations';
import { useForm } from 'react-hook-form';

export interface SimulationFormContextType {
    // Form state
    form: ReturnType<typeof useForm<SimulationBasicInfoForm>>;
    
    // Page navigation
    currentPage: number;
    setCurrentPage: (page: number) => void;
    handleNext: () => Promise<void>;
    handlePrevious: () => void;
    handleNextByProgressIndicator: (newPageNo: number) => Promise<void>;
    
    // Dialog flow state
    updatedNodes: DialogFlowNode[];
    updatedEdges: DialogFlowEdge[];
    initialNodes: DialogFlowNode[];
    initialEdges: DialogFlowEdge[];
    setUpdatedNodes: React.Dispatch<React.SetStateAction<DialogFlowNode[]>>;
    setUpdatedEdges: React.Dispatch<React.SetStateAction<DialogFlowEdge[]>>;
    
    // Validation and errors
    dialogErrors: string[];
    validateCurrentPage: () => Promise<boolean>;
    validateDialogNodes: () => string[];
    
    // UI state
    tipsOpen: boolean;
    setTipsOpen: (open: boolean) => void;
    dataLoading: boolean;
    
    // Form submission
    isSubmitting: boolean;
    handleFormSubmit: () => Promise<void>;
}