import { useState, useEffect, useRef, useMemo } from 'react';
import CircularProgress from './CircularProgress';
import { DialogScore } from '@/types/evaluations';

const getStatusColor = (status: string): string => {
    const colors: Record<string, string> = {
        'green': '#2ecc71',
        'yellow': '#f39c12',
        'red': '#e74c3c',
        'gray': '#95a5a6',
        'default': '#3498db'
    };

    return colors[status] || colors.default;
};

interface DialogScoreFlowDiagramProps {
    dialogScores: DialogScore[];
}

export default function DialogScoreFlowDiagram ({dialogScores}: DialogScoreFlowDiagramProps) {
    const [nodes] = useState<DialogScore[]>(dialogScores); // Make nodes immutable
    const [dimensions, setDimensions] = useState({ width: 1000, height: 500 });

    // Fix the ref type to HTMLDivElement
    const containerRef = useRef<HTMLDivElement>(null);

    // Define constants for visualization
    const minLevel = -1;
    const maxLevel = 2;
    const levelRange = maxLevel - minLevel + 1;
    const levelHeight = 120;
    // Add top and bottom padding to ensure room for popups
    const topPadding = 100; // Increased to allow more space for popups
    const bottomPadding = 0; // Added bottom padding for better spacing
    const leftLabelWidth = 120; // Width reserved for fixed labels
    const startX = 200;
    const nodeSpacing = 150;
    const levelLabels = ["Exemplary", "Fair", "Subpar", "Irrelevant"];
    const totalRequiredWidth = startX + (nodes.length - 1) * nodeSpacing + startX;

    // Calculate node positions with memoization to prevent unnecessary recalculation
    const calculatedNodes = useMemo(() => {
        // Move the getVisualLevel function inside the useMemo callback
        const getVisualLevel = (score: number): number => {
            const clampedScore = Math.max(minLevel, Math.min(maxLevel, score));
            return maxLevel - clampedScore;
        };
        
        const nodeCount = nodes.length;
        const totalRequiredWidth = startX + (nodeCount - 1) * nodeSpacing + startX;

        let startingX = startX;
        if (dimensions.width > totalRequiredWidth) {
            startingX = (dimensions.width - ((nodeCount - 1) * nodeSpacing)) / 2;
        }

        return nodes.map((node, index) => ({
            ...node,
            x: startingX + (index * nodeSpacing),
            y: getVisualLevel(node.dialog_score) * levelHeight + topPadding
        }));
    }, [nodes, dimensions.width, levelHeight, topPadding, minLevel, maxLevel]); // removed getVisualLevel, added minLevel & maxLevel

    // Update dimensions on mount and window resize
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const width = containerRef.current.clientWidth - 45;
                // Keep the same total height, but distribute differently
                const height = levelRange * levelHeight + topPadding + bottomPadding;
                setDimensions({ width, height });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, [levelRange, levelHeight, topPadding, bottomPadding]);

    return (
        <div ref={containerRef} className="w-full bg-white rounded-lg shadow-lg p-4 mb-6">
            {/* Use a flex container to position fixed labels next to scrollable content */}
            <div className="w-full flex border-2 border-gray-300">
                {/* Fixed labels on the left */}
                <div className="relative" style={{ width: `${leftLabelWidth}px`, minWidth: `${leftLabelWidth}px` }}>
                    <svg
                        width={leftLabelWidth}
                        height={dimensions.height}
                        className=""
                    >
                        {Array.from({ length: levelRange }).map((_, i) => (
                            <g key={`fixed-label-${i}`}>
                                <text
                                    x="60"
                                    y={(i * levelHeight) + topPadding + 5}
                                    fontSize="17"
                                    fontWeight="bold"
                                    textAnchor="middle"
                                    className="fill-gray-700 text-start font-bold"
                                >
                                    {levelLabels[i]} {`(${maxLevel - i})`}
                                </text>
                            </g>
                        ))}
                    </svg>
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-x-auto">
                    <svg
                        width={Math.max(dimensions.width, totalRequiredWidth) - leftLabelWidth}
                        height={dimensions.height}
                        className=""
                    >
                        {/* Horizontal lines for levels */}
                        {Array.from({ length: levelRange }).map((_, i) => (
                            <g key={`level-${i}`}>
                                <line
                                    x1="0"
                                    y1={(i * levelHeight) + topPadding}
                                    x2={Math.max(dimensions.width, totalRequiredWidth) - leftLabelWidth - 40}
                                    y2={(i * levelHeight) + topPadding}
                                    stroke="#000000"
                                    strokeWidth="2"
                                    strokeDasharray="10,5"
                                    className="text-gray-500"
                                />
                            </g>
                        ))}

                        {/* Connections between neighbor nodes */}
                        {calculatedNodes.map((node, index) => {
                            if (index === calculatedNodes.length - 1) return null;
                            const nextNode = calculatedNodes[index + 1];
                            return (
                                <line
                                    key={`conn-${index}`}
                                    x1={node.x - leftLabelWidth} // Adjust X position for the fixed label area
                                    y1={node.y}
                                    x2={nextNode.x - leftLabelWidth} // Adjust X position for the fixed label area
                                    y2={nextNode.y}
                                    stroke={"#000000"}
                                    strokeWidth={5}
                                />
                            );
                        })}

                        {/* First render all the nodes (circles) */}
                        {calculatedNodes.map((node, index) => (
                            <g key={`node-base-${index}`}>
                                <circle
                                    cx={node.x - leftLabelWidth} // Adjust X position for the fixed label area
                                    cy={node.y}
                                    r={30}
                                    fill={getStatusColor(node.status)}
                                    stroke="#666666"
                                    strokeWidth={3}
                                    className="group-hover:r-35 group-hover:stroke-black group-hover:stroke-4"
                                />

                                <text
                                    x={node.x - leftLabelWidth} // Adjust X position for the fixed label area
                                    y={node.y}
                                    fontSize="16"
                                    fontWeight="bold"
                                    fill="#ffffff"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                    className="group-hover:font-size-18"
                                >
                                    {node.dialog_sequence}
                                </text>

                                <text
                                    x={node.x - leftLabelWidth} // Adjust X position for the fixed label area
                                    y={node.y + 45}
                                    fontSize="12"
                                    fill="#000000"
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                >
                                    Status: {node.status}, Score: {node.dialog_score}
                                </text>
                            </g>
                        ))}

                        {/* Then render all the interaction groups and popups separately */}
                        {calculatedNodes.map((node, index) => {
                            return (
                                <g
                                    key={`node-hover-${index}`}
                                    className="group" // Add group class for the peer hover effect
                                    style={{ cursor: 'pointer' }}
                                >
                                    {/* Invisible hover target */}
                                    <circle
                                        cx={node.x - leftLabelWidth} // Adjust X position for the fixed label area
                                        cy={node.y}
                                        r={30}
                                        fill="transparent"
                                        stroke="transparent"
                                        pointerEvents="all"
                                    />

                                    {/* Popup that appears on hover using peer-hover concept */}
                                    <foreignObject
                                        x={node.x - leftLabelWidth - 180} // Adjust X position for the fixed label area
                                        y={node.dialog_score >= 1 ? node.y - 90 : node.y - 170}
                                        // y={node.dialog_score >= 1 ? node.y + 55 : node.y - 310}
                                        width="360"
                                        height="270"
                                        className="overflow-visible invisible group-hover:visible"
                                        style={{ zIndex: 50 }}
                                    >
                                        <div
                                            className="w-full h-full flex flex-col bg-white overflow-hidden p-3 rounded-lg shadow-lg border border-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50"
                                        >
                                            <div className="w-full h-auto flex justify-between items-center mb-2">
                                                <h3 className="font-bold text-base">Dialog Sequence: {node.dialog_sequence}</h3>
                                            </div>

                                            <div className="w-full h-full overflow-y-auto pr-2y">
                                                <p className="text-gray-800 font-medium mb-2 p-2 bg-gray-100 rounded-md italic">
                                                    {`"${node.dialog}"`}
                                                </p>
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-sm">Status:
                                                        <span className="font-semibold ml-1" style={{ color: getStatusColor(node.status) }}>
                                                            {node.status}
                                                        </span>
                                                    </span>
                                                    <span className="text-sm">Dialog Score: <span className="font-semibold">{node.dialog_score}</span></span>
                                                </div>
                                                <div className="mt-3 border-t pt-2">
                                                    <div className="">
                                                        <div className="w-full h-auto">
                                                            <h4 className="font-bold text-sm mb-1">Emotional Intelligence Assessment:</h4>
                                                            <div className="w-full h-auto flex gap-1">
                                                                <div className="flex-1 h-auto">
                                                                    <h5 className='font-semibold text-xs mb-1'>Active Listening</h5>
                                                                    <p className="text-xs text-gray-600">{node.emotional_intelligence.active_listening.description}</p>
                                                                </div>
                                                                <div className="w-16 h-auto flex flex-col items-center justify-start">
                                                                    <CircularProgress
                                                                        currentValue={node.emotional_intelligence.active_listening.score ?? 0}
                                                                        maxValue={5}
                                                                        size={50}
                                                                        strokeWidth={5}
                                                                        textClassName='font-semibold text-xs text-black'
                                                                    />
                                                                    <h3 className='text-xs'>Score</h3>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </foreignObject>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            </div>
        </div>
    );
};