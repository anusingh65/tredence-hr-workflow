import React, { useState } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { simulateWorkflow } from '../../api/mockApi';
import type { SimulationResult } from '../../types/workflow';
import { NODE_COLORS } from '../../utils/nodeUtils';
import type { NodeType } from '../../types/workflow';
import { X, Play, CheckCircle, XCircle, Loader } from 'lucide-react';

export function SimulationPanel() {
  const { simulationOpen, setSimulationOpen, nodes, edges } = useWorkflowStore();
  const [result, setResult] = useState<SimulationResult|null>(null);
  const [running, setRunning] = useState(false);
  const [revealed, setRevealed] = useState(0);

  if (!simulationOpen) return null;

  const run = async () => {
    setRunning(true); setResult(null); setRevealed(0);
    const res = await simulateWorkflow(nodes as any, edges);
    setResult(res); setRunning(false);
    for (let i=1; i<=res.steps.length; i++) { await new Promise(r=>setTimeout(r,150)); setRevealed(i); }
  };

  const close = () => { setSimulationOpen(false); setResult(null); setRevealed(0); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#1a1f2e] border border-[#252d3d] rounded-2xl w-[640px] max-h-[80vh] flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#252d3d]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 border border-orange-500/30 flex items-center justify-center"><Play size={14} className="text-orange-400"/></div>
            <div><h2 className="text-white font-semibold">Workflow Simulator</h2><p className="text-xs text-gray-400">{nodes.length} nodes · {edges.length} edges</p></div>
          </div>
          <button onClick={close} className="p-2 rounded-lg hover:bg-[#141720] text-gray-400 hover:text-white transition-colors"><X size={16}/></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-5 gap-2">
            {(['start','task','approval','automated','end'] as NodeType[]).map(type => {
              const c=NODE_COLORS[type], count=nodes.filter(n=>n.data.type===type).length;
              return <div key={type} className="rounded-xl p-3 border text-center" style={{background:c.bg,borderColor:c.border}}>
                <p className="text-lg font-bold" style={{color:c.accent}}>{count}</p>
                <p className="text-xs text-gray-400 capitalize">{type}</p>
              </div>;
            })}
          </div>
          {!result && !running && (
            <button onClick={run} className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold transition-colors flex items-center justify-center gap-2"><Play size={16}/>Execute Simulation</button>
          )}
          {running && <div className="flex items-center justify-center gap-3 py-8"><Loader size={20} className="text-orange-400 animate-spin"/><span className="text-gray-400 text-sm">Simulating workflow...</span></div>}
          {result && result.errors.length>0 && (
            <div className="rounded-xl border border-red-800/50 bg-red-950/30 p-4">
              <div className="flex items-center gap-2 mb-2"><XCircle size={14} className="text-red-400"/><span className="text-sm font-semibold text-red-400">Validation Failed</span></div>
              <ul className="space-y-1">{result.errors.map((e,i)=><li key={i} className="text-xs text-red-300 flex items-start gap-2"><span className="text-red-500">•</span>{e}</li>)}</ul>
            </div>
          )}
          {result && result.success && (
            <div>
              <div className="flex items-center gap-2 mb-3"><CheckCircle size={14} className="text-green-400"/><span className="text-sm font-semibold text-green-400">{result.summary}</span></div>
              <div className="space-y-2">
                {result.steps.slice(0,revealed).map((step,i) => {
                  const c=NODE_COLORS[step.nodeType];
                  return (
                    <div key={step.nodeId} className="flex items-start gap-3 p-3 rounded-xl border animate-fade-in" style={{background:c.bg,borderColor:c.border}}>
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono border" style={{color:c.accent,borderColor:c.border}}>{i+1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-sm font-semibold text-white">{step.label}</span>
                          <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{color:c.accent,background:`${c.accent}20`}}>{step.nodeType}</span>
                        </div>
                        <p className="text-xs text-gray-400">{step.message}</p>
                      </div>
                      <CheckCircle size={14} className="text-green-400 flex-shrink-0"/>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {result && <button onClick={run} className="w-full py-2.5 rounded-xl border border-[#252d3d] hover:border-orange-500 text-gray-400 hover:text-orange-400 text-sm transition-colors flex items-center justify-center gap-2"><Play size={13}/>Run Again</button>}
        </div>
      </div>
    </div>
  );
}
