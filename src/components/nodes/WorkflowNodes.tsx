import React from 'react';
import type { NodeProps } from 'reactflow';
import { BaseNode } from './BaseNode';
import type { StartNodeData, TaskNodeData, ApprovalNodeData, AutomatedNodeData, EndNodeData, WorkflowNodeData } from '../../types/workflow';

export function StartNode(p: NodeProps<StartNodeData>) {
  return <BaseNode {...p as NodeProps<WorkflowNodeData>} showTarget={false} subtitle="Workflow entry point">
    <div className="flex items-center gap-1.5 mt-1"><div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"/><span className="text-xs text-green-400 font-mono">READY</span></div>
  </BaseNode>;
}
export function TaskNode(p: NodeProps<TaskNodeData>) {
  return <BaseNode {...p as NodeProps<WorkflowNodeData>} subtitle={p.data.description||'No description'}>
    <div className="flex flex-col gap-1 mt-1">
      {p.data.assignee && <div className="flex items-center gap-1.5"><div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">{p.data.assignee[0]?.toUpperCase()}</div><span className="text-xs text-gray-400 truncate">{p.data.assignee}</span></div>}
      {p.data.dueDate && <span className="text-xs text-gray-400 font-mono">📅 {p.data.dueDate}</span>}
    </div>
  </BaseNode>;
}
export function ApprovalNode(p: NodeProps<ApprovalNodeData>) {
  return <BaseNode {...p as NodeProps<WorkflowNodeData>} subtitle={`Approver: ${p.data.approverRole||'Not set'}`}>
    <div className="flex items-center gap-2 mt-1"><span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/50 text-purple-300 border border-purple-700/50">{p.data.approverRole||'Role TBD'}</span></div>
  </BaseNode>;
}
export function AutomatedNode(p: NodeProps<AutomatedNodeData>) {
  return <BaseNode {...p as NodeProps<WorkflowNodeData>} subtitle={p.data.actionId?`Action: ${p.data.actionId}`:'No action selected'}>
    <div className="flex items-center gap-1.5 mt-1"><div className="w-1.5 h-1.5 rounded-full bg-orange-400"/><span className="text-xs text-orange-300 font-mono truncate">{p.data.actionId||'select action...'}</span></div>
  </BaseNode>;
}
export function EndNode(p: NodeProps<EndNodeData>) {
  return <BaseNode {...p as NodeProps<WorkflowNodeData>} showSource={false} subtitle={p.data.endMessage||'Workflow complete'}>
    <div className="flex items-center gap-2 mt-1"><div className="w-1.5 h-1.5 rounded-full bg-red-400"/><span className="text-xs text-red-400 font-mono">TERMINAL</span>{p.data.summaryFlag&&<span className="text-xs text-gray-400 ml-auto">+summary</span>}</div>
  </BaseNode>;
}
