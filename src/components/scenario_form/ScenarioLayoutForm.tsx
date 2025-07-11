'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import RoomLayoutWarning from './RoomLayoutWarning';

// Define item types for drag and drop
const ItemTypes = {
  GRID_ITEM: 'gridItem',
  SIDEBAR_ITEM: 'sidebarItem',
} as const;

interface ObjectType {
  id: string;
  name: string;
  width: number;
  height: number;
  color: string;
}

interface PlacedObjectType extends ObjectType {
  row: number;
  col: number;
  isFromSidebar: boolean;
}

interface DragItem extends ObjectType {
  isFromSidebar?: boolean;
  row?: number;
  col?: number;
}

interface CellPosition {
  row: number;
  col: number;
}

interface DropResult {
  dropped?: boolean;
  deleted?: boolean;
  row?: number;
  col?: number;
}

// Main component
export default function ScenarioLayoutForm() {
  // Fix for Next.js hydration issues with react-dnd
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className='w-full'>
      <DndProvider backend={HTML5Backend}>
        <DragDropGrid />
      </DndProvider>
    </div>
  );
}

// Grid layout component with drag and drop functionality
interface ObjectType {
  id: string;
  name: string;
  width: number;
  height: number;
  color: string;
  asset_type: 'A' | 'P'
}

function DragDropGrid() {
  // Reduced grid size for smaller height
  const [gridRowSize, setGridRowSize] = useState<number>(10);
  const [gridColumnSize, setGridColumnSize] = useState<number>(20);
  // Smaller cell size to reduce overall height
  const CELL_SIZE = 50;
  const MAX_GRID_SIZE = 50;
  
  // Function to handle grid size changes
  const handleGridSizeChange = useCallback((type: 'row' | 'column', value: number) => {
    const newValue = Math.max(1, Math.min(MAX_GRID_SIZE, value)); // Constrain between 1 and 20
    
    if (type === 'row') {
      setGridRowSize(newValue);
    } else {
      setGridColumnSize(newValue);
    }
    
    // Reset the grid and placed objects when size changes
    setPlacedObjects([]);
    setGrid(Array(type === 'row' ? newValue : gridRowSize)
      .fill(null)
      .map(() => Array(type === 'column' ? newValue : gridColumnSize).fill(null))
    );
  }, [gridRowSize, gridColumnSize]);

  // Define available objects with their sizes
  const objectTypes: ObjectType[] = [
    { id: '4B', asset_type: "P", name: 'Succulent Plant 1x1', width: 1, height: 1, color: 'bg-blue-500' },
    { id: '1A', asset_type: "A", name: 'Proteus Avatar 1x1', width: 1, height: 1, color: 'bg-green-500' },
    { id: '1B', asset_type: "A", name: 'Patient Avatar 1x1', width: 1, height: 1, color: 'bg-yellow-500' },
    { id: '3B', asset_type: "P", name: 'Front Curvy Desk 4x7', width: 4, height: 3, color: 'bg-purple-500' }, // Reduced height
    { id: '4A', asset_type: "P", name: 'Three Seat Bench 3x1', width: 3, height: 1, color: 'bg-red-500' },
    { id: '4C', asset_type: "P", name: 'Mud Mat 1x1', width: 1, height: 1, color: 'bg-pink-500' },
    { id: '4D', asset_type: "P", name: 'Wheelchair 1x1', width: 1, height: 1, color: 'bg-indigo-500' },
  ];

  // States
  const [placedObjects, setPlacedObjects] = useState<PlacedObjectType[]>([]);
  const [grid, setGrid] = useState<(string | null)[][]>(createEmptyGrid());
  const [hoveredCell, setHoveredCell] = useState<CellPosition | null>(null);
  const [currentDragItem, setCurrentDragItem] = useState<DragItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Create empty grid
  function createEmptyGrid(): (string | null)[][] {
    return Array(gridRowSize).fill(null).map(() => Array(gridColumnSize).fill(null));
  }

  // Clear object from grid
  const clearObjectFromGrid = useCallback((objectId: string): (string | null)[][] | undefined => {
    const object = placedObjects.find(obj => obj.id === objectId);
    if (!object) return;

    // Clear the grid cells
    const newGrid = [...grid];
    for (let r = object.row; r < object.row + object.height; r++) {
      for (let c = object.col; c < object.col + object.width; c++) {
        newGrid[r][c] = null;
      }
    }
    return newGrid;
  }, [grid, placedObjects]);

  // Check if object can be placed at a specific position
  const canPlaceObject = useCallback((
    object: DragItem | null,
    row: number,
    col: number,
    objectBeingMoved: DragItem | null = null
  ): boolean => {
    if (!object) return false;

    // Check boundaries
    if (
      row < 0 ||
      col < 0 ||
      row + object.height > gridRowSize ||
      col + object.width > gridColumnSize
    ) {
      return false;
    }

    // If we're moving an object, we need to ignore its current position
    const objectIdToIgnore = objectBeingMoved ? objectBeingMoved.id : null;

    // Check if all cells in the range are empty or belong to the object being moved
    for (let r = row; r < row + object.height; r++) {
      for (let c = col; c < col + object.width; c++) {
        const cellContent = grid[r][c];
        if (cellContent !== null && cellContent !== objectIdToIgnore) {
          return false;
        }
      }
    }

    return true;
  }, [grid, gridColumnSize, gridRowSize]);

  // Place an object on the grid at the specific position
  const placeObject = useCallback((object: DragItem, row: number, col: number): boolean => {
    let newGrid = [...grid];

    // For an existing object that's being moved, clear its previous position first
    if (!object.isFromSidebar) {
      newGrid = clearObjectFromGrid(object.id) || newGrid;
    }

    // Create a new object with updated position
    const newObject: PlacedObjectType = {
      ...object,
      id: object.isFromSidebar ? `${object.id}-${Date.now()}` : object.id,
      row,
      col,
      isFromSidebar: false // Once placed, it's no longer from sidebar
    };

    // Mark cells in the grid
    for (let r = row; r < row + object.height; r++) {
      for (let c = col; c < col + object.width; c++) {
        newGrid[r][c] = newObject.id;
      }
    }

    setGrid(newGrid);

    // Update the placed objects list
    setPlacedObjects(prev => {
      // Remove existing object with same ID if it exists
      const filtered = prev.filter(obj => obj.id !== newObject.id);
      return [...filtered, newObject];
    });

    return true;
  }, [grid, clearObjectFromGrid]);

  // Handle drop of an object on a grid cell
  const handleDrop = useCallback((item: DragItem | null, row: number, col: number): boolean => {
    if (!item) return false;

    // Check if we can place the object at this position
    if (!canPlaceObject(item, row, col, item)) {
      return false;
    }

    // Place the object on the grid
    return placeObject(item, row, col);
  }, [canPlaceObject, placeObject]);

  // Delete an object permanently (used by DeleteZone)
  const deleteObject = useCallback((objectId: string): boolean => {
    // Clear the object from the grid
    const newGrid = clearObjectFromGrid(objectId);
    if (newGrid) {
      setGrid(newGrid);
    }

    // Remove from placed objects state
    setPlacedObjects(prev => prev.filter(obj => obj.id !== objectId));

    setIsDeleting(false);
    return true;
  }, [clearObjectFromGrid]);

  // Render hover preview
  const renderHoverPreview = () => {
    if (!hoveredCell || !currentDragItem) return null;

    const { row, col } = hoveredCell;
    const { width, height } = currentDragItem;

    const canPlace = canPlaceObject(currentDragItem, row, col, currentDragItem);

    return (
      <div
        className={`absolute rounded ${canPlace ? 'opacity-40' : 'opacity-30 bg-red-300'} border-2 ${canPlace ? 'border-green-500' : 'border-red-500'}`}
        style={{
          top: row * CELL_SIZE,
          left: col * CELL_SIZE,
          width: width * CELL_SIZE,
          height: height * CELL_SIZE,
          pointerEvents: 'none',
        }}
      />
    );
  };

  return (
    <>
    <RoomLayoutWarning />
    <div className="bg-gray-50 py-4 px-4">
      <div className="flex flex-col md:flex-row w-full gap-4 max-w-6xl mx-auto">
        {/* Sidebar - Made more compact */}
        <div className="w-full md:w-56 bg-white shadow-md p-3 rounded">
          <h2 className="text-sm font-semibold mb-2">Available Objects</h2>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
            {objectTypes.map((object) => (
              <SidebarItem
                key={object.id}
                item={object}
                setCurrentDragItem={setCurrentDragItem}
              />
            ))}
          </div>

          {/* Delete zone - Made more compact */}
          <DeleteZone
            isOver={isDeleting}
            setIsOver={setIsDeleting}
          />
        </div>

        {/* Main content */}
        <div className="flex-1">
          <h2 className="text-lg font-bold mb-2">Grid Layout</h2>
          
          {/* Grid size controls */}
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-2">
              <label htmlFor="rowSize" className="text-xs font-medium">Rows:</label>
              <input
                id="rowSize"
                type="number"
                min="1"
                max={`${MAX_GRID_SIZE}`}
                value={gridRowSize}
                onChange={(e) => handleGridSizeChange('row', parseInt(e.target.value) || 1)}
                className="w-16 px-2 py-1 text-xs border border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="colSize" className="text-xs font-medium">Columns:</label>
              <input
                id="colSize"
                type="number"
                min="1"
                max={`${MAX_GRID_SIZE}`}
                value={gridColumnSize}
                onChange={(e) => handleGridSizeChange('column', parseInt(e.target.value) || 1)}
                className="w-16 px-2 py-1 text-xs border border-gray-300 rounded"
              />
            </div>
          </div>

          {/* Grid container */}
          <div
            className="relative inline-block border border-gray-300 bg-white shadow-md"
          >
            {/* Grid cells with row and col indices in each cell */}
            {Array(gridRowSize).fill(null).map((_, rowIndex) => (
              <div key={`row-${rowIndex}`} className="flex">
                {Array(gridColumnSize).fill(null).map((_, colIndex) => (
                  <GridCell
                    key={`cell-${rowIndex}-${colIndex}`}
                    row={rowIndex}
                    col={colIndex}
                    cellSize={CELL_SIZE}
                    onDrop={(item) => handleDrop(item, rowIndex, colIndex)}
                    setHoveredCell={setHoveredCell}
                    currentDragItem={currentDragItem}
                    canPlaceObject={() => currentDragItem ? canPlaceObject(currentDragItem, rowIndex, colIndex, currentDragItem) : false}
                  />
                ))}
              </div>
            ))}

            {/* Hover preview */}
            {renderHoverPreview()}

            {/* Placed objects */}
            {placedObjects.map((object) => (
              <PlacedObject
                key={object.id}
                object={object}
                cellSize={CELL_SIZE}
                setCurrentDragItem={setCurrentDragItem}
                deleteObject={deleteObject}
                setIsDeleting={setIsDeleting}
              />
            ))}
          </div>

          <div className="mt-2 text-xs text-gray-600 flex flex-wrap gap-2">
            <p>• Drag objects from sidebar to grid</p>
            <p>• Drag placed objects to move</p>
            <p>• Drag to trash to delete</p>
            <p>• Objects cannot overlap</p>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

interface SidebarItemProps {
  item: ObjectType;
  setCurrentDragItem: (item: DragItem | null) => void;
}

// Sidebar Item Component - Made more compact
function SidebarItem({ item, setCurrentDragItem }: SidebarItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.SIDEBAR_ITEM,
    item: (): DragItem => {
      const dragItem: DragItem = { ...item, isFromSidebar: true };
      setCurrentDragItem(dragItem);
      return dragItem;
    },
    end: () => {
      setCurrentDragItem(null);
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [item, setCurrentDragItem]);

  // Use useRef to handle the ref
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Connect the drag ref with our React ref
  useEffect(() => {
    drag(elementRef);
  }, [drag]);

  return (
    <div
      ref={elementRef}
      className={`${item.color} rounded p-1 cursor-move text-white text-center transition hover:shadow-lg ${isDragging ? 'opacity-50' : 'hover:scale-105'
        }`}
    >
      <div className="text-xs">{item.name}</div>
      <div className="text-xs opacity-80">{item.width}x{item.height}</div>
    </div>
  );
}

interface PlacedObjectProps {
  object: PlacedObjectType;
  cellSize: number;
  setCurrentDragItem: (item: DragItem | null) => void;
  deleteObject: (id: string) => boolean;
  setIsDeleting: (isDeleting: boolean) => void;
}

// Placed Object Component (already on the grid)
function PlacedObject({
  object,
  cellSize,
  setCurrentDragItem,
  deleteObject
}: PlacedObjectProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.GRID_ITEM,
    item: (): DragItem => {
      // Set the current drag item with original properties
      const dragItem: DragItem = { ...object };
      setCurrentDragItem(dragItem);
      return dragItem;
    },
    end: (_, monitor) => {
      const dropResult = monitor.getDropResult<DropResult>();
      setCurrentDragItem(null);

      // If dropped on delete zone, delete the object
      if (dropResult && dropResult.deleted) {
        deleteObject(object.id);
      }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }), [object, setCurrentDragItem, deleteObject]);

  // Use useRef to handle the ref
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Connect the drag ref with our React ref
  useEffect(() => {
    drag(elementRef);
  }, [drag]);

  // Don't render if it's being dragged
  if (isDragging) {
    return null;
  }

  return (
    <div
      ref={elementRef}
      className={`absolute ${object.color} rounded shadow cursor-move flex items-center justify-center transition hover:brightness-110 hover:shadow-md`}
      style={{
        top: object.row * cellSize,
        left: object.col * cellSize,
        width: object.width * cellSize,
        height: object.height * cellSize,
        zIndex: 10,
      }}
    >
      <span className="text-white text-xs font-medium">
        {object.name}
      </span>
    </div>
  );
}

interface GridCellProps {
  row: number;
  col: number;
  cellSize: number;
  onDrop: (item: DragItem) => boolean;
  setHoveredCell: (position: CellPosition | null) => void;
  currentDragItem: DragItem | null;
  canPlaceObject: () => boolean;
}

// Grid Cell Component
function GridCell({
  row,
  col,
  cellSize,
  onDrop,
  setHoveredCell,
  canPlaceObject
}: GridCellProps) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: [ItemTypes.SIDEBAR_ITEM, ItemTypes.GRID_ITEM],
    drop: (item: DragItem): DropResult => {
      const result = onDrop(item);
      return { dropped: result, row, col };
    },
    canDrop: canPlaceObject,
    hover: () => {
      setHoveredCell({ row, col });
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }), [row, col, onDrop, canPlaceObject, setHoveredCell]);

  // Use useRef to handle the ref
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Connect the drop ref with our React ref
  useEffect(() => {
    drop(elementRef);
  }, [drop]);

  // Visual feedback for hover states
  let cellClass = 'border border-gray-200 transition flex items-center justify-center';
  if (isOver) {
    cellClass += canDrop ? ' bg-green-50' : ' bg-red-50';
  } else {
    cellClass += ' hover:bg-gray-50';
  }

  return (
    <div
      ref={elementRef}
      className={cellClass}
      style={{
        width: cellSize,
        height: cellSize
      }}
    >
      {/* Display row,col coordinates in each cell */}
      <span className="text-xs text-gray-400 pointer-events-none">{row},{col}</span>
    </div>
  );
}

interface DeleteZoneProps {
  isOver: boolean;
  setIsOver: (isOver: boolean) => void;
}

// Delete Zone Component - Made more compact
function DeleteZone({ isOver, setIsOver }: DeleteZoneProps){
  const [{}, drop] = useDrop(() => ({
    accept: ItemTypes.GRID_ITEM, // Only accept items from the grid, not from sidebar
    drop: (): DropResult => {
      return { deleted: true };
    },
    hover: () => {
      setIsOver(true);
    },
    canDrop: () => true,
    collect: (monitor) => ({
      canDrop: !!monitor.canDrop(),
    }),
  }), [setIsOver]);

  // Use useRef to handle the ref
  const elementRef = useRef<HTMLDivElement>(null);
  
  // Connect the drop ref with our React ref
  useEffect(() => {
    drop(elementRef);
  }, [drop]);

  return (
    <div
      ref={elementRef}
      className={`mt-4 p-2 border-2 border-dashed border-red-500 text-center rounded transition ${isOver ? 'bg-red-200 scale-105' : 'bg-red-100'
        }`}
    >
      <svg className="w-5 h-5 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
      </svg>
      <p className="text-xs text-red-500 font-medium">Drop to delete</p>
    </div>
  );
}