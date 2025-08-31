"use client"
import { useContext } from 'react';
import { UseFormRegister, FieldErrors, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { SimulationBasicInfoForm } from '@/types/simulations';
import { newSimulationStorage } from '@/utils/storage_name';
import { LocalStorageContext } from '@/lib/redux/LocalStorageContext';
import { inputMaxLength } from '@/config/index'
import CharacterCounterFormInput from '@/components/text/CharacterCounterFormInput';
import CharacterCounterFormTextArea from '@/components/text/CharacterCounterFormTextArea';
import EvaluationPanelToggle from './EvaluationPanelToggle';
import SimulationObjectives from './SimulationObjectives';
import ProgramAffiliation from './ProgramAffiliation';

interface ScenarioInfoFormProps {
    register: UseFormRegister<SimulationBasicInfoForm>;
    errors: FieldErrors<SimulationBasicInfoForm>;
    setValue: UseFormSetValue<SimulationBasicInfoForm>;
    watch: UseFormWatch<SimulationBasicInfoForm>;
}

export default function ScenarioInfoForm({
    register,
    errors,
    setValue,
    watch
}: ScenarioInfoFormProps) {
    const { saveToLocalStorage, saveToLocalStorageAsync } = useContext(LocalStorageContext);

    return (
        <form className="w-full flex-none bg-gray-100 p-5">
            <div className="w-full h-12 text-2xl font-semibold">
                Add Basic Info
            </div>

            <div className="w-full h-auto grid grid-cols-2 gap-6">
                <div className=' space-y-1.5'>
                    <ProgramAffiliation
                        register={register}
                        errors={errors}
                        setValue={setValue}
                    />

                    <div>
                        <label className="block text-xl mb-1 font-light italic" htmlFor="scenario_name">
                            <span className="relative">Scenario Name</span>
                        </label>
                        <CharacterCounterFormInput
                            id="scenario_name"
                            type='text'
                            formFieldName='scenario_name'
                            register={register}
                            errors={errors}
                            watch={watch}
                            maxLength={inputMaxLength.scenario.name}
                            required={true}
                            requiredMessage='Scenario name is required'
                            onChange={(event) => {
                                saveToLocalStorage(newSimulationStorage.scenario_name, event.target.value)
                            }}
                            onBlur={(event) => {
                                saveToLocalStorageAsync(newSimulationStorage.scenario_name, event.target.value)
                            }}
                        />
                    </div>

                    <div>
                        <label
                            className="block text-xl mb-1 font-light italic"
                            htmlFor='scenario_description'
                        >
                            Scenario Description
                        </label>
                        <div className="relative">
                            <CharacterCounterFormTextArea
                                id="scenario_description"
                                rows={4}
                                formFieldName='scenario_description'
                                register={register}
                                errors={errors}
                                watch={watch}
                                maxLength={inputMaxLength.scenario.description}
                                required={true}
                                requiredMessage='Scenario description is required'
                                onChange={(event) => {
                                    saveToLocalStorage(newSimulationStorage.scenario_description, event.target.value)
                                }}
                                onBlur={(event) => {
                                    saveToLocalStorageAsync(newSimulationStorage.scenario_description, event.target.value)
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xl mb-1 font-light italic" htmlFor="scenario_overview">Scenario Overview</label>
                        <div className="relative">
                            <CharacterCounterFormTextArea
                                id="scenario_overview"
                                rows={4}
                                formFieldName='scenario_overview'
                                register={register}
                                errors={errors}
                                watch={watch}
                                maxLength={inputMaxLength.scenario.overview}
                                required={true}
                                requiredMessage='Scenario overview is required'
                                onChange={(event) => {
                                    saveToLocalStorage(newSimulationStorage.scenario_overview, event.target.value)
                                }}
                                onBlur={(event) => {
                                    saveToLocalStorageAsync(newSimulationStorage.scenario_overview, event.target.value)
                                }}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xl mb-1 font-light italic" htmlFor="scenario_related_details">Scenario Related Details</label>
                        <div className="relative">
                            <CharacterCounterFormTextArea
                                id="scenario_related_details"
                                rows={4}
                                formFieldName='scenario_related_details'
                                register={register}
                                errors={errors}
                                watch={watch}
                                maxLength={inputMaxLength.scenario.related_details}
                                required={true}
                                requiredMessage='Scenario related details is required'
                                onChange={(event) => {
                                    saveToLocalStorage(newSimulationStorage.scenario_related_details, event.target.value)
                                }}
                                onBlur={(event) => {
                                    saveToLocalStorageAsync(newSimulationStorage.scenario_related_details, event.target.value)
                                }}

                            />
                        </div>
                    </div>
                </div>

                <div className=' space-y-1.5'>
                    <div>
                        <label htmlFor="simulation_title" className="block text-xl mb-1 font-light italic">Simulation Title</label>
                        <div className="relative">
                            <CharacterCounterFormInput
                                id="simulation_title"
                                type='text'
                                formFieldName='simulation_title'
                                register={register}
                                errors={errors}
                                watch={watch}
                                maxLength={inputMaxLength.simulation.title}
                                required={true}
                                requiredMessage='Simulation title is required'
                                onChange={(event) => {
                                    saveToLocalStorage(newSimulationStorage.simulation_title, event.target.value)
                                }}
                                onBlur={(event) => {
                                    saveToLocalStorageAsync(newSimulationStorage.simulation_title, event.target.value)
                                }}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-xl mb-1 font-light italic">Simulation Description</label>
                        <div className="relative">
                            <CharacterCounterFormTextArea
                                rows={4}
                                formFieldName='simulation_description'
                                register={register}
                                errors={errors}
                                watch={watch}
                                maxLength={inputMaxLength.scenario.description}
                                required={true}
                                requiredMessage='Scenario related details is required'
                                onChange={(event) => {
                                    saveToLocalStorage(newSimulationStorage.simulation_description, event.target.value)
                                }}
                                onBlur={(event) => {
                                    saveToLocalStorageAsync(newSimulationStorage.simulation_description, event.target.value)
                                }}
                            />
                        </div>
                    </div>

                    <EvaluationPanelToggle
                        register={register}
                        setValue={setValue}
                        watch={watch}
                        saveToLocalStorage={saveToLocalStorage}
                        storageKey={newSimulationStorage.show_evaluation_panel}
                    />

                    <div className="mb-4">
                        <label
                            className="block text-xl mb-1 font-light italic"
                            htmlFor="avatar_designation"
                        >
                            Avatar Designation
                        </label>

                        <CharacterCounterFormInput
                            id='avatar_designation'
                            type='text'
                            formFieldName='avatar_designation'
                            register={register}
                            errors={errors}
                            watch={watch}
                            maxLength={inputMaxLength.avatar.designation}
                            required={true}
                            requiredMessage='Avatar designation is required'
                            onChange={(event) => {
                                saveToLocalStorage(newSimulationStorage.avatar_designation, event.target.value)
                            }}
                            onBlur={(event) => {
                                saveToLocalStorageAsync(newSimulationStorage.avatar_designation, event.target.value)
                            }}

                            placeholder="e.g. patient"
                        />
                    </div>

                    <SimulationObjectives
                        setValue={setValue}
                        errors={errors}
                    />
                </div>
            </div>
        </form>
    );
}