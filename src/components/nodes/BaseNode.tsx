import React from 'react';
import { Handle, Position } from 'reactflow';
import type { NodeProps } from 'reactflow';
import type { WorkflowNodeData, NodeType } from '../../types/workflow';
import { NODE_COLORS } from '../../utils/nodeUtils';
import { useWorkflowStore } from '../../store/workflowStore';
import { Trash2, Settings } from 'lucide-react';

interface Props extends NodeProps<WorkflowNodeData> { showSource?: boolean; showTarget?: boolean; subtitle?: string; children?: React.ReactNode; }

export function BaseNode({ id, data, selected, showSource=true, showTarget=true, subtitle, children }: Props) {
  const { selectNode, deleteNode } = useWorkflowStore();
  const c = NODE_COLORS[data.type as NodeType];
  return (
    <div onClick={() => selectNode(id)}
      style={{ background: c.bg, borderColor: selected ? c.accent : c.border, boxShadow: selected ? `0 0 16px ${c.accent}44` : 'none' }}
      className="relative rounded-xl border-2 min-w-[200px] max-w-[240px] cursor-pointer transition-all duration-200 group">
      <div className="flex items-center gap-2 px-3 py-2 rounded-t-xl border-b" style={{ borderColor: c.border, background: `${c.accent}18` }}>
        <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded" style={{ color: c.accent, background: `${c.accent}22` }}>{data.type.toUpperCase()}</span>
        <span className="text-white text-sm font-semibold truncate flex-1">{data.label}</span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={e => { e.stopPropagation(); selectNode(id); }} className="p-0.5 rounded hover:bg-white/10"><Settings size={12} style={{ color: c.accent }} /></button>
          <button onClick={e => { e.stopPropagation(); deleteNode(id); }} className="p-0.5 rounded hover:bg-red-500/20"><Trash2 size={12} className="text-red-400" /></button>
        </div>
      </div>
      <div className="px-3 py-2">
        {subtitle && <p className="text-xs text-gray-400 mb-1 truncate">{subtitle}</p>}
        {children}
      </div>
      <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border-2 border-[#0d0f14]" style={{ background: selected ? c.accent : c.border }} />
      {showTarget && <Handle type="target" position={Position.Top} style={{ top: -6 }} />}
      {showSource && <Handle type="source" position={Position.Bottom} style={{ bottom: -6 }} />}
    </div>
  );
}
