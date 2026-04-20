import React from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { Play } from 'lucide-react';
export function TopBar() {
  const { workflowName, nodes, edges, setSimulationOpen } = useWorkflowStore();
  return (
    <header className="h-12 bg-[#1a1f2e] border-b border-[#252d3d] flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-2 text-sm">
        <span className="text-gray-400">Workflows</span><span className="text-[#252d3d]">/</span>
        <span className="text-white font-semibold">{workflowName}</span>
      </div>
      <div className="flex items-center gap-4 text-xs text-gray-400 font-mono">
        <span>{nodes.length} nodes</span><span className="text-[#252d3d]">|</span>
        <span>{edges.length} edges</span><span className="text-[#252d3d]">|</span>
        <span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/>Live</span>
      </div>
      <button onClick={()=>setSimulationOpen(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-white text-xs font-semibold transition-colors">
        <Play size={11}/>Simulate
      </button>
    </header>
  );
}
