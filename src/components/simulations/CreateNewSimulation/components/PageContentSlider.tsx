"use client"
import React from 'react';
import ScenarioFormFinalView from '@/components/simulations/CreateNewSimulation/components/ScenarioFormFinalView';
import ScenarioInfoForm from '@/components/simulations/CreateNewSimulation/components/ScenarioInfoForm';
import SimulationTree from '@/components/reactflow/SimulationTree';
import Room3DCanvas from '@/components/simulations/CreateNewSimulation/objects_layout/canvas/Room3DCanvas';
import FullscreenWrapper from '../FullscreenWrapper';
import { useSimulationForm } from '../contexts/SimulationFormContext';

export default function PageContentSlider(){
    const {
        currentPage,
        form: { register, formState: { errors }, setValue, watch },
        updatedNodes,
        updatedEdges,
        initialNodes,
        initialEdges,
        setUpdatedNodes,
        setUpdatedEdges
    } = useSimulationForm();

    return (
        <div className="w-full grow overflow-hidden">
            <FullscreenWrapper showIcon={currentPage === 1 || currentPage === 2} fullScreenByKey={false}>
                <div 
                    className="w-full h-full flex" 
                    style={{ 
                        transform: `translateX(-${currentPage * 100}%)`, 
                        transition: 'transform 0.3s ease' 
                    }}
                >
                    {/* Page 0: Scenario Info Form */}
                    <div className='w-full shrink-0 h-auto'>
                        <ScenarioInfoForm
                            register={register}
                            errors={errors}
                            setValue={setValue}
                            watch={watch}
                        />
                    </div>
                    
                    {/* Page 1: Simulation Tree */}
                    <div className='w-full shrink-0 h-full'>
                        <SimulationTree
                            initialEdges={initialEdges}
                            initialNodes={initialNodes}
                            editable={true}
                            setUpdatedNodes={setUpdatedNodes}
                            setUpdatedEdges={setUpdatedEdges}
                            bgStyleClass={'bg-gray-200 text-black'}
                        />
                    </div>
                    
                    {/* Page 2: 3D Room Canvas */}
                    <div className='w-full shrink-0 h-full'>
                        <Room3DCanvas />
                    </div>
                    
                    {/* Page 3: Final View */}
                    <div className='w-full shrink-0 h-auto'>
                        <ScenarioFormFinalView 
                            simulation={{ ...watch() }} 
                            dialogFlowNodes={updatedNodes} 
                            dialogFlowEdges={updatedEdges} 
                        />
                    </div>
                </div>
            </FullscreenWrapper>
        </div>
    );
}