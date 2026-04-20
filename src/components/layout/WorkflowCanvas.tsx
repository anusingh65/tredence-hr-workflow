import React, { useCallback } from 'react';
import ReactFlow, { Background, Controls, MiniMap, BackgroundVariant } from 'reactflow';
import type { NodeTypes } from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '../../store/workflowStore';
import { StartNode, TaskNode, ApprovalNode, AutomatedNode, EndNode } from '../nodes/WorkflowNodes';

const nodeTypes: NodeTypes = { start:StartNode, task:TaskNode, approval:ApprovalNode, automated:AutomatedNode, end:EndNode };

export function WorkflowCanvas() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, selectNode } = useWorkflowStore();
  const onPaneClick = useCallback(() => selectNode(null), [selectNode]);
  return (
    <div className="flex-1 h-full relative" style={{background:'#0d0f14'}}>
      <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange} onEdgesChange={onEdgesChange} onConnect={onConnect} onPaneClick={onPaneClick} nodeTypes={nodeTypes} fitView fitViewOptions={{padding:0.3}} deleteKeyCode="Delete" defaultEdgeOptions={{animated:true,style:{stroke:'#f97316',strokeWidth:2}}}>
        <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="#1e2535"/>
        <Controls position="bottom-right"/>
        <MiniMap position="bottom-left" nodeColor={n=>({start:'#22c55e',task:'#3b82f6',approval:'#a855f7',automated:'#f97316',end:'#ef4444'})[n.type||'']||'#4a5568'} maskColor="rgba(0,0,0,0.5)"/>
      </ReactFlow>
      {nodes.length===0 && <div className="absolute inset-0 flex items-center justify-center pointer-events-none"><div className="text-center"><div className="text-5xl mb-4 opacity-20">⊡</div><p className="text-gray-400 text-sm opacity-60">Add nodes from the sidebar to start building</p></div></div>}
    </div>
  );
}
