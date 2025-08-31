// User Manual Tips component with toggle button
export default function SimulationsUserManualTips({ currentPage, isOpen, setIsOpen }: {
    currentPage: number,
    isOpen: boolean,
    setIsOpen: (value: boolean) => void
}) {
    const tipsByPage = [
        // Page 0: Basic Information
        <div key="page0" className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Basic Information Tips:</strong>
            <ul className="mt-2 list-disc pl-5">
                <li>{`All fields are required before proceeding`}</li>
                <li>{`Program Affiliation connects this simulation to your department`}</li>
                <li>{`Add at least one learning objective`}</li>
                <li>{`Scenario Description appears in listings, while Overview provides context for the learner`}</li>
                <li>{`Avatar Designation defines who the AI character represents (e.g., "patient")`}</li>
            </ul>
        </div>,

        // Page 1: Chat Flow Design
        <div key="page1" className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Chat Flow Design Tips:</strong>
            <ul className="mt-2 list-disc pl-5">
                <li>{`Each Human node (V) must have exactly one Avatar node (A) response`}</li>
                <li>{`All dialog nodes must contain text`}</li>
                <li>{`Connect nodes to create conversation branches`}</li>
                <li>{`Avoid disconnected nodes that aren't part of the flow`}</li>
                <li>{`Use meaningful conversations that align with your learning objectives`}</li>
            </ul>
        </div>,

        // Page 2: Room Layout Design
        <div key="page2" className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Room Layout Tips:</strong>
            <ul className="mt-2 list-disc pl-5">
                <li>{`Adjust grid size to create your desired room dimensions`}</li>
                <li>{`Drag objects from the sidebar onto the grid`}</li>
                <li>{`Reposition objects by dragging them on the grid`}</li>
                <li>{`Delete objects by dragging to the "Drop to delete" zone`}</li>
                <li>{`Objects cannot overlap - check placement if you see red indicators`}</li>
            </ul>
        </div>,

        // Page 3: Review and Submit
        <div key="page3" className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Review and Submit Tips:</strong>
            <ul className="mt-2 list-disc pl-5">
                <li>{`Review all simulation information for accuracy`}</li>
                <li>{`Check that chat flow meets educational objectives`}</li>
                <li>{`Verify room layout is appropriate for the scenario`}</li>
                <li>{`Click "Submit" when ready to create the simulation`}</li>
                <li>{`After submission, you'll be redirected to view your new simulation`}</li>
            </ul>
        </div>
    ];

    return (
        <div className="w-full px-5">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-2 font-medium"
            >
                <span>{isOpen ? "Hide" : "Show"} Tips</span>
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </button>

            {/* Collapsible tips content */}
            <div
                className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                {tipsByPage[currentPage]}
            </div>
        </div>
    );
};
