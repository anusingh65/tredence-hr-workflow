import React from 'react';
import type { NodeType, WorkflowNodeData } from '../../types/workflow';
import { NODE_COLORS, NODE_LABELS, NODE_DESCRIPTIONS, generateId } from '../../utils/nodeUtils';
import { useWorkflowStore } from '../../store/workflowStore';
import type { Node } from 'reactflow';
import { Download, Upload, Play, RotateCcw } from 'lucide-react';

const NODE_TYPES: NodeType[] = ['start','task','approval','automated','end'];

function getDefault(type: NodeType): WorkflowNodeData {
  switch(type) {
    case 'start':     return { type, label:'Start', metadata:[] };
    case 'task':      return { type, label:'New Task', description:'', assignee:'', dueDate:'', customFields:[] };
    case 'approval':  return { type, label:'Approval', approverRole:'Manager', autoApproveThreshold:0 };
    case 'automated': return { type, label:'Automated Step', actionId:'', actionParams:{} };
    case 'end':       return { type, label:'End', endMessage:'Workflow completed.', summaryFlag:false };
  }
}

export function NodeSidebar() {
  const { addNode, nodes, edges, setSimulationOpen, workflowName, setWorkflowName, exportWorkflow, importWorkflow } = useWorkflowStore();
  const handleAdd = (type: NodeType) => {
    addNode({ id:generateId(), type, position:{ x:200+Math.random()*200, y:150+Math.random()*150 }, data:getDefault(type) } as Node<WorkflowNodeData>);
  };
  const handleExport = () => {
    const blob = new Blob([exportWorkflow()], { type:'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href=url; a.download=`${workflowName.replace(/\s+/g,'_')}.json`; a.click(); URL.revokeObjectURL(url);
  };
  const handleImport = () => {
    const input = document.createElement('input'); input.type='file'; input.accept='.json';
    input.onchange = e => { const f=(e.target as HTMLInputElement).files?.[0]; if(!f) return; const r=new FileReader(); r.onload=ev=>importWorkflow(ev.target?.result as string); r.readAsText(f); };
    input.click();
  };
  const handleReset = () => { if(confirm('Reset canvas?')) useWorkflowStore.setState({nodes:[],edges:[],selectedNodeId:null}); };

  return (
    <aside className="w-64 bg-[#1a1f2e] border-r border-[#252d3d] flex flex-col h-full flex-shrink-0">
      <div className="p-4 border-b border-[#252d3d]">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center"><span className="text-white font-bold text-xs">T</span></div>
          <span className="text-white font-semibold text-sm">Tredence Studio</span>
        </div>
        <input value={workflowName} onChange={e=>setWorkflowName(e.target.value)} className="w-full bg-[#0d0f14] border border-[#252d3d] rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors" placeholder="Workflow name..."/>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-3">Node Palette</p>
        <div className="space-y-2">
          {NODE_TYPES.map(type => {
            const c = NODE_COLORS[type];
            return (
              <button key={type} onClick={()=>handleAdd(type)} className="w-full text-left rounded-xl border p-3 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]" style={{ background:c.bg, borderColor:c.border }}>
                <div className="flex items-center justify-between">
                  <div><p className="text-sm font-semibold text-white">{NODE_LABELS[type]}</p><p className="text-xs text-gray-400 mt-0.5">{NODE_DESCRIPTIONS[type]}</p></div>
                  <span className="text-xs font-mono px-1.5 py-0.5 rounded" style={{ color:c.accent, background:`${c.accent}22` }}>+ ADD</span>
                </div>
              </button>
            );
          })}
        </div>
        <div className="mt-6 p-3 rounded-xl bg-[#141720] border border-[#252d3d]">
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-2 font-semibold">Canvas Stats</p>
          <div className="grid grid-cols-2 gap-2">
            <div><p className="text-xl font-bold text-white">{nodes.length}</p><p className="text-xs text-gray-400">Nodes</p></div>
            <div><p className="text-xl font-bold text-white">{edges.length}</p><p className="text-xs text-gray-400">Edges</p></div>
          </div>
        </div>
      </div>
      <div className="p-4 border-t border-[#252d3d] space-y-2">
        <button onClick={()=>setSimulationOpen(true)} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-semibold text-sm transition-colors">
          <Play size={14}/>Run Simulation
        </button>
        <div className="grid grid-cols-3 gap-2">
          {[{icon:<Download size={12}/>,label:'Export',fn:handleExport},{icon:<Upload size={12}/>,label:'Import',fn:handleImport},{icon:<RotateCcw size={12}/>,label:'Reset',fn:handleReset}].map(({icon,label,fn})=>(
            <button key={label} onClick={fn} className="flex items-center justify-center gap-1 py-2 rounded-lg bg-[#141720] border border-[#252d3d] hover:border-orange-500 text-gray-400 hover:text-orange-400 text-xs transition-colors">{icon}{label}</button>
          ))}
        </div>
      </div>
    </aside>
  );
}
