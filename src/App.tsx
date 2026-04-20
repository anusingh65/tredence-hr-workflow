import React, { useEffect } from 'react';
import { NodeSidebar } from './components/panels/NodeSidebar';
import { WorkflowCanvas } from './components/layout/WorkflowCanvas';
import { NodeEditPanel } from './components/forms/NodeEditPanel';
import { TopBar } from './components/layout/TopBar';
import { SimulationPanel } from './components/panels/SimulationPanel';
import { useWorkflowStore } from './store/workflowStore';
import { generateId } from './utils/nodeUtils';
import type { WorkflowNodeData } from './types/workflow';
import type { Node } from 'reactflow';

function useSample() {
  const { nodes, addNode, onConnect } = useWorkflowStore();
  useEffect(() => {
    if (nodes.length > 0) return;
    const s = generateId(), t = generateId(), a = generateId(), au = generateId(), e = generateId();
    const sample: Node<WorkflowNodeData>[] = [
      { id:s, type:'start',     position:{x:240,y:60},  data:{type:'start',label:'Onboarding Start',metadata:[{key:'dept',value:'Engineering'}]} },
      { id:t, type:'task',      position:{x:120,y:200}, data:{type:'task',label:'Collect Documents',description:'ID, offer letter, bank details',assignee:'HR Manager',dueDate:'2025-08-15',customFields:[]} },
      { id:a, type:'approval',  position:{x:360,y:200}, data:{type:'approval',label:'Manager Approval',approverRole:'Manager',autoApproveThreshold:80} },
      { id:au,type:'automated', position:{x:240,y:360}, data:{type:'automated',label:'Send Welcome Email',actionId:'send_email',actionParams:{to:'{{email}}',subject:'Welcome!',body:'Hi there'}} },
      { id:e, type:'end',       position:{x:240,y:500}, data:{type:'end',label:'Onboarding Complete',endMessage:'Employee successfully onboarded.',summaryFlag:true} },
    ];
    sample.forEach(n => addNode(n));
    setTimeout(() => {
      onConnect({source:s,target:t,sourceHandle:null,targetHandle:null});
      onConnect({source:s,target:a,sourceHandle:null,targetHandle:null});
      onConnect({source:t,target:au,sourceHandle:null,targetHandle:null});
      onConnect({source:a,target:au,sourceHandle:null,targetHandle:null});
      onConnect({source:au,target:e,sourceHandle:null,targetHandle:null});
    }, 50);
  }, []);
}

export default function App() {
  useSample();
  const { selectedNodeId } = useWorkflowStore();
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden" style={{background:'#0d0f14'}}>
      <TopBar/>
      <div className="flex flex-1 overflow-hidden">
        <NodeSidebar/>
        <WorkflowCanvas/>
        {selectedNodeId && <NodeEditPanel/>}
      </div>
      <SimulationPanel/>
    </div>
  );
}
