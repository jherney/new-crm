import type { Deal, DealStage, DealStageMeta } from '../types';

interface ClosedStageDropZonesProps {
  closedStages: DealStageMeta[];
  deals: Deal[];
  dragOverStage: DealStage | null;
  onDragOver: (event: React.DragEvent, stage: DealStage) => void;
  onDragLeave: () => void;
  onDrop: (event: React.DragEvent, stage: DealStage) => void;
}

/** Drop targets so deals can be moved to Closed Won / Closed Lost from the board. */
export default function ClosedStageDropZones({ closedStages, deals, dragOverStage, onDragOver, onDragLeave, onDrop }: ClosedStageDropZonesProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" aria-label="Closed stages">
      {closedStages.map(stage => {
        const stageDeals = deals.filter(d => d.stage === stage.key);
        const stageValue = stageDeals.reduce((sum, d) => sum + d.value, 0);
        const isDragTarget = dragOverStage === stage.key;
        return (
          <div
            key={stage.key}
            onDragOver={event => onDragOver(event, stage.key)}
            onDragLeave={onDragLeave}
            onDrop={event => onDrop(event, stage.key)}
            className={`rounded-xl border-2 border-dashed p-4 transition-colors ${isDragTarget ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}`}
          >
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }} aria-hidden="true" />
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">{stage.label}</h2>
              <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-1.5 py-0.5 rounded-full">{stageDeals.length}</span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">${stageValue.toLocaleString()} · drop a deal here to close it</p>
          </div>
        );
      })}
    </div>
  );
}
