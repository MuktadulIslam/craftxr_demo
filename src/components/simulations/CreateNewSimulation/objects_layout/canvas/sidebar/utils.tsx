import { DraggableObjectGroup } from "./types";
import BoxObject from "../../objects/BoxObject"
import Car from "../../objects/Car"
import CarModel from "../../objects/Car2"
import Chair from "../../objects/Chair"
import ChildrenTableModel from "../../objects/ChildrenTableModel"
import CustomObject from "../../objects/CustomObject"
import Table from "../../objects/Table"
import TableModel from "../../objects/TableModel"
import DeskSign from "../../objects/craftxr/DeskSign"
import DisabilityButton from "../../objects/craftxr/DisabilityButton"
import FaxMachine from "../../objects/craftxr/FaxMachine"
import Keyboard from "../../objects/craftxr/Keyboard"
import Monitor from "../../objects/craftxr/Monitor"
import Monstera from "../../objects/craftxr/Monstera"
import Mouse from "../../objects/craftxr/Mouse"
import MudMat from "../../objects/craftxr/MudMat"
import OldRecepDesk from "../../objects/craftxr/OldRecepDesk"
import Pen from "../../objects/craftxr/Pen"
import Printer from "../../objects/craftxr/Printer"
import ReceptionDesk from "../../objects/craftxr/ReceptionDesk"
import Succulent from "../../objects/craftxr/Succulent"
import TissueBox from "../../objects/craftxr/TissueBox"
import WaitingBench from "../../objects/craftxr/WaitingBench"
import Wheelchair from "../../objects/craftxr/Wheelchair"
import { SelectableObjectRef } from "../types";

export const sidebarStaticObjectGroups: DraggableObjectGroup[] = [
    {
        id: 'vehicles',
        name: 'Vehicles',
        icon: '🚗',
        color: 'from-blue-500 to-cyan-500',
        objects: [
            {
                id: 'car',
                componentFactory: (meshRef: SelectableObjectRef) => <Car meshRef={meshRef} />,
                name: 'Car',
                icon: '🚗',
                description: 'Simple car object'
            },
            {
                id: 'car-2',
                componentFactory: (meshRef: SelectableObjectRef) => <CarModel meshRef={meshRef} />,
                name: 'GLB Car Model',
                icon: '🏎️',
                description: 'Detailed car model'
            }
        ]
    },
    {
        id: 'furniture',
        name: 'Furniture',
        icon: '🪑',
        color: 'from-amber-500 to-orange-500',
        objects: [
            {
                id: 'table',
                componentFactory: (meshRef: SelectableObjectRef) => <Table meshRef={meshRef} />,
                name: 'Table',
                icon: '🪑',
                description: 'Basic table geometry'
            },
            {
                id: 'table model',
                componentFactory: (meshRef: SelectableObjectRef) => <TableModel meshRef={meshRef} />,
                name: 'GLB Table Model',
                icon: '🗂️',
                description: 'Detailed table model'
            },
            {
                id: 'children table model',
                componentFactory: (meshRef: SelectableObjectRef) => <ChildrenTableModel meshRef={meshRef} />,
                name: 'GLB Children Table',
                icon: '🧸',
                description: 'Child-sized table model'
            },
            {
                id: 'chair',
                componentFactory: (meshRef: SelectableObjectRef) => <Chair meshRef={meshRef} />,
                name: 'Chair',
                icon: '💺',
                description: 'Basic chair geometry'
            }
        ]
    },
    {
        id: 'primitives',
        name: 'Primitives',
        icon: '📦',
        color: 'from-green-500 to-emerald-500',
        objects: [
            {
                id: 'box',
                componentFactory: (meshRef: SelectableObjectRef) => <BoxObject meshRef={meshRef} />,
                name: 'Box',
                icon: '📦',
                description: 'Basic cube geometry'
            }
        ]
    },
    {
        id: 'custom',
        name: 'Custom',
        icon: '⚡',
        color: 'from-purple-500 to-pink-500',
        objects: [
            {
                id: 'custom',
                componentFactory: (meshRef: SelectableObjectRef) => <CustomObject meshRef={meshRef} />,
                name: 'Custom Object',
                icon: '⚡',
                description: 'Custom 3D object'
            }
        ]
    },
    {
        id: 'xr-models',
        name: 'XR-Models',
        icon: '🏢',
        color: 'from-indigo-500 to-purple-500',
        objects: [
            {
                id: 'desk-sign',
                componentFactory: (meshRef: SelectableObjectRef) => <DeskSign meshRef={meshRef} />,
                name: 'Desk Sign',
                icon: '🪧',
                description: 'Desktop nameplate or information sign'
            },
            {
                id: 'disability-button',
                componentFactory: (meshRef: SelectableObjectRef) => <DisabilityButton meshRef={meshRef} />,
                name: 'Accessibility Button',
                icon: '♿',
                description: 'Disability access button for doors'
            },
            {
                id: 'fax-machine',
                componentFactory: (meshRef: SelectableObjectRef) => <FaxMachine meshRef={meshRef} />,
                name: 'Fax Machine',
                icon: '📠',
                description: 'Office fax machine'
            },
            {
                id: 'keyboard',
                componentFactory: (meshRef: SelectableObjectRef) => <Keyboard meshRef={meshRef} />,
                name: 'Keyboard',
                icon: '⌨️',
                description: 'Computer keyboard'
            },
            {
                id: 'monitor',
                componentFactory: (meshRef: SelectableObjectRef) => <Monitor meshRef={meshRef} />,
                name: 'Monitor',
                icon: '🖥️',
                description: 'Computer display monitor'
            },
            {
                id: 'monstera',
                componentFactory: (meshRef: SelectableObjectRef) => <Monstera meshRef={meshRef} />,
                name: 'Monstera Plant',
                icon: '🌱',
                description: 'Decorative monstera house plant'
            },
            {
                id: 'mouse',
                componentFactory: (meshRef: SelectableObjectRef) => <Mouse meshRef={meshRef} />,
                name: 'Computer Mouse',
                icon: '🖱️',
                description: 'Computer pointing device'
            },
            {
                id: 'mud-mat',
                componentFactory: (meshRef: SelectableObjectRef) => <MudMat meshRef={meshRef} />,
                name: 'Floor Mat',
                icon: '🧽',
                description: 'Entrance floor mat'
            },
            {
                id: 'old-reception-desk',
                componentFactory: (meshRef: SelectableObjectRef) => <OldRecepDesk meshRef={meshRef} />,
                name: 'Vintage Reception Desk',
                icon: '🗃️',
                description: 'Classic style reception desk'
            },
            {
                id: 'pen',
                componentFactory: (meshRef: SelectableObjectRef) => <Pen meshRef={meshRef} />,
                name: 'Pen',
                icon: '🖊️',
                description: 'Writing pen'
            },
            {
                id: 'printer',
                componentFactory: (meshRef: SelectableObjectRef) => <Printer meshRef={meshRef} />,
                name: 'Printer',
                icon: '🖨️',
                description: 'Office printer'
            },
            {
                id: 'reception-desk',
                componentFactory: (meshRef: SelectableObjectRef) => <ReceptionDesk meshRef={meshRef} />,
                name: 'Reception Desk',
                icon: '🏪',
                description: 'Modern reception desk'
            },
            {
                id: 'succulent',
                componentFactory: (meshRef: SelectableObjectRef) => <Succulent meshRef={meshRef} />,
                name: 'Succulent Plant',
                icon: '🌵',
                description: 'Small decorative succulent'
            },
            {
                id: 'tissue-box',
                componentFactory: (meshRef: SelectableObjectRef) => <TissueBox meshRef={meshRef} />,
                name: 'Tissue Box',
                icon: '📄',
                description: 'Box of tissues'
            },
            {
                id: 'waiting-bench',
                componentFactory: (meshRef: SelectableObjectRef) => <WaitingBench meshRef={meshRef} />,
                name: 'Waiting Bench',
                icon: '🪑',
                description: 'Seating bench for waiting areas'
            },
            {
                id: 'wheelchair',
                componentFactory: (meshRef: SelectableObjectRef) => <Wheelchair meshRef={meshRef} />,
                name: 'Wheelchair',
                icon: '♿',
                description: 'Mobility wheelchair'
            }
        ]
    }
];