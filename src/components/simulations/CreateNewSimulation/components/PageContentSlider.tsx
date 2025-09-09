"use client"
import React, { useMemo } from 'react';
import ScenarioFormFinalView from '@/components/simulations/CreateNewSimulation/components/ScenarioFormFinalView';
import ScenarioInfoForm from '@/components/simulations/CreateNewSimulation/components/ScenarioInfoForm';
import SimulationTree from '@/components/reactflow/SimulationTree';
import Room3DCanvas from '@/components/simulations/CreateNewSimulation/objects_layout/canvas/Room3DCanvas';
import FullscreenWrapper from '../FullscreenWrapper';
import { useSimulationForm } from '../contexts/SimulationFormContext';

export default function PageContentSlider() {
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
    const watchedData = watch();

    const scenarioInfoFormComponent = useMemo(() => (
        <ScenarioInfoForm
            register={register}
            errors={errors}
            setValue={setValue}
            watch={watch}
        />
    ), [register, errors, setValue, watch]);

    const simulationTreeComponent = useMemo(() => (
        <SimulationTree
            initialEdges={initialEdges}
            initialNodes={initialNodes}
            editable={true}
            setUpdatedNodes={setUpdatedNodes}
            setUpdatedEdges={setUpdatedEdges}
            bgStyleClass={'bg-gray-200 text-black'}
        />
    ), [initialEdges, initialNodes, setUpdatedNodes, setUpdatedEdges]);


    const scenarioFormFinalViewComponent = useMemo(() => (
        <ScenarioFormFinalView
            simulation={{ ...watchedData }}
            dialogFlowNodes={updatedNodes}
            dialogFlowEdges={updatedEdges}
        />
    ), [watchedData, updatedNodes, updatedEdges]);


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
                    <div className='w-full shrink-0 h-auto'>
                        {scenarioInfoFormComponent}
                    </div>
                    <div className='w-full shrink-0 h-full'>
                        {simulationTreeComponent}
                    </div>
                    <div className='w-full shrink-0 h-full'>
                        <Room3DCanvas />
                    </div>
                    <div className='w-full shrink-0 h-auto'>
                        {scenarioFormFinalViewComponent}
                    </div>
                </div>
            </FullscreenWrapper>
        </div>
    );
}