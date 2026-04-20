import React from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { KeyValueField } from './KeyValueField';
import { useAutomations } from '../../hooks/useAutomations';
import type { StartNodeData, TaskNodeData, ApprovalNodeData, AutomatedNodeData, EndNodeData, WorkflowNodeData } from '../../types/workflow';
import { NODE_COLORS } from '../../utils/nodeUtils';
import { X } from 'lucide-react';

const inp = 'w-full bg-[#0d0f14] border border-[#252d3d] rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 transition-colors';
const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div><label className="block text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1.5">{label}</label>{children}</div>
);

function StartForm({ data, id }: { data: StartNodeData; id: string }) {
  const upd = (p: Partial<StartNodeData>) => useWorkflowStore.getState().updateNodeData(id, p);
  return <div className="space-y-4">
    <Field label="Start Title"><input value={data.label} onChange={e=>upd({label:e.target.value})} className={inp} placeholder="Workflow start title"/></Field>
    <KeyValueField label="Metadata" pairs={data.metadata} onChange={metadata=>upd({metadata})}/>
  </div>;
}

function TaskForm({ data, id }: { data: TaskNodeData; id: string }) {
  const upd = (p: Partial<TaskNodeData>) => useWorkflowStore.getState().updateNodeData(id, p);
  return <div className="space-y-4">
    <Field label="Title *"><input value={data.label} onChange={e=>upd({label:e.target.value})} className={inp} placeholder="Task title (required)"/></Field>
    <Field label="Description"><textarea value={data.description} onChange={e=>upd({description:e.target.value})} className={`${inp} resize-none h-20`} placeholder="Describe the task..."/></Field>
    <Field label="Assignee"><input value={data.assignee} onChange={e=>upd({assignee:e.target.value})} className={inp} placeholder="e.g. HR Manager"/></Field>
    <Field label="Due Date"><input type="date" value={data.dueDate} onChange={e=>upd({dueDate:e.target.value})} className={`${inp} [color-scheme:dark]`}/></Field>
    <KeyValueField label="Custom Fields" pairs={data.customFields} onChange={customFields=>upd({customFields})}/>
  </div>;
}

function ApprovalForm({ data, id }: { data: ApprovalNodeData; id: string }) {
  const upd = (p: Partial<ApprovalNodeData>) => useWorkflowStore.getState().updateNodeData(id, p);
  return <div className="space-y-4">
    <Field label="Title"><input value={data.label} onChange={e=>upd({label:e.target.value})} className={inp} placeholder="Approval step name"/></Field>
    <Field label="Approver Role">
      <select value={data.approverRole} onChange={e=>upd({approverRole:e.target.value})} className={`${inp} cursor-pointer`}>
        <option value="">Select role...</option>
        {['Manager','HRBP','Director','VP','C-Suite','Team Lead'].map(r=><option key={r} value={r}>{r}</option>)}
      </select>
    </Field>
    <Field label="Auto-Approve Threshold">
      <div className="flex items-center gap-3">
        <input type="range" min={0} max={100} value={data.autoApproveThreshold} onChange={e=>upd({autoApproveThreshold:Number(e.target.value)})} className="flex-1 accent-orange-500"/>
        <span className="text-sm font-mono text-orange-400 w-8 text-right">{data.autoApproveThreshold}</span>
      </div>
      <p className="text-xs text-gray-500 mt-1">{data.autoApproveThreshold===0?'Manual approval required':`Auto-approve when score ≥ ${data.autoApproveThreshold}`}</p>
    </Field>
  </div>;
}

function AutomatedForm({ data, id }: { data: AutomatedNodeData; id: string }) {
  const upd = (p: Partial<AutomatedNodeData>) => useWorkflowStore.getState().updateNodeData(id, p);
  const { automations, loading } = useAutomations();
  const selected = automations.find(a=>a.id===data.actionId);
  const handleChange = (actionId: string) => {
    const action = automations.find(a=>a.id===actionId);
    const actionParams: Record<string,string> = {};
    action?.params.forEach(p=>(actionParams[p]=data.actionParams?.[p]||''));
    upd({ actionId, actionParams });
  };
  return <div className="space-y-4">
    <Field label="Title"><input value={data.label} onChange={e=>upd({label:e.target.value})} className={inp}/></Field>
    <Field label="Action">
      {loading ? <p className="text-xs text-gray-400 animate-pulse py-2">Loading actions...</p> :
        <select value={data.actionId} onChange={e=>handleChange(e.target.value)} className={`${inp} cursor-pointer`}>
          <option value="">Select an action...</option>
          {automations.map(a=><option key={a.id} value={a.id}>{a.label}</option>)}
        </select>}
    </Field>
    {selected && selected.params.length > 0 && <div className="space-y-3">
      <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Parameters</p>
      {selected.params.map(param=>(
        <Field key={param} label={param.replace(/_/g,' ')}>
          <input value={data.actionParams?.[param]||''} onChange={e=>upd({actionParams:{...data.actionParams,[param]:e.target.value}})} className={inp} placeholder={`Enter ${param}...`}/>
        </Field>
      ))}
    </div>}
  </div>;
}

function EndForm({ data, id }: { data: EndNodeData; id: string }) {
  const upd = (p: Partial<EndNodeData>) => useWorkflowStore.getState().updateNodeData(id, p);
  return <div className="space-y-4">
    <Field label="End Message"><textarea value={data.endMessage} onChange={e=>upd({endMessage:e.target.value})} className={`${inp} resize-none h-20`} placeholder="Completion message..."/></Field>
    <Field label="Generate Summary">
      <label className="flex items-center gap-3 cursor-pointer">
        <div onClick={()=>upd({summaryFlag:!data.summaryFlag})} className={`relative w-10 h-5 rounded-full transition-colors ${data.summaryFlag?'bg-orange-500':'bg-[#252d3d]'}`}>
          <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${data.summaryFlag?'translate-x-5':'translate-x-0'}`}/>
        </div>
        <span className="text-sm text-white">{data.summaryFlag?'Summary enabled':'No summary'}</span>
      </label>
    </Field>
  </div>;
}

export function NodeEditPanel() {
  const { nodes, selectedNodeId, selectNode } = useWorkflowStore();
  const node = nodes.find(n=>n.id===selectedNodeId);
  if (!node) return (
    <div className="w-72 bg-[#1a1f2e] border-l border-[#252d3d] flex flex-col items-center justify-center h-full text-center p-8 flex-shrink-0">
      <div className="w-12 h-12 rounded-2xl bg-[#141720] border border-[#252d3d] flex items-center justify-center mb-4 text-2xl">⊡</div>
      <p className="text-white font-semibold text-sm mb-1">No node selected</p>
      <p className="text-gray-400 text-xs">Click any node on the canvas to edit it</p>
    </div>
  );
  const data = node.data as WorkflowNodeData;
  const c = NODE_COLORS[data.type];
  return (
    <aside className="w-72 bg-[#1a1f2e] border-l border-[#252d3d] flex flex-col h-full flex-shrink-0 animate-slide-in">
      <div className="px-4 py-3 border-b border-[#252d3d] flex items-center justify-between" style={{ background:`${c.accent}0f` }}>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{background:c.accent}}/><span className="text-sm font-semibold text-white capitalize">{data.type} Node</span></div>
        <button onClick={()=>selectNode(null)} className="text-gray-400 hover:text-white p-1 rounded"><X size={14}/></button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {data.type==='start'     && <StartForm    data={data} id={node.id}/>}
        {data.type==='task'      && <TaskForm      data={data} id={node.id}/>}
        {data.type==='approval'  && <ApprovalForm  data={data} id={node.id}/>}
        {data.type==='automated' && <AutomatedForm data={data} id={node.id}/>}
        {data.type==='end'       && <EndForm       data={data} id={node.id}/>}
      </div>
      <div className="px-4 py-2 border-t border-[#252d3d]"><p className="text-xs text-gray-500 font-mono truncate">id: {node.id}</p></div>
    </aside>
  );
}
