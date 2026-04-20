import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges, addEdge } from 'reactflow';
import type { Node, Edge, NodeChange, EdgeChange, Connection } from 'reactflow';
import type { WorkflowNodeData } from '../types/workflow';

interface WorkflowState {
  nodes: Node<WorkflowNodeData>[]; edges: Edge[];
  selectedNodeId: string | null; simulationOpen: boolean; workflowName: string;
  setNodes: (n: Node<WorkflowNodeData>[]) => void;
  onNodesChange: (c: NodeChange[]) => void;
  onEdgesChange: (c: EdgeChange[]) => void;
  onConnect: (c: Connection) => void;
  selectNode: (id: string | null) => void;
  updateNodeData: (id: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (id: string) => void;
  addNode: (n: Node<WorkflowNodeData>) => void;
  setSimulationOpen: (o: boolean) => void;
  setWorkflowName: (n: string) => void;
  exportWorkflow: () => string;
  importWorkflow: (json: string) => void;
}

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [], edges: [], selectedNodeId: null, simulationOpen: false, workflowName: 'Employee Onboarding',
  setNodes: (nodes) => set({ nodes }),
  onNodesChange: (changes) => set(s => ({ nodes: applyNodeChanges(changes, s.nodes) as Node<WorkflowNodeData>[] })),
  onEdgesChange: (changes) => set(s => ({ edges: applyEdgeChanges(changes, s.edges) })),
  onConnect: (conn) => set(s => ({ edges: addEdge({ ...conn, animated: true, style: { stroke: '#f97316', strokeWidth: 2 } }, s.edges) })),
  selectNode: (id) => set({ selectedNodeId: id }),
  updateNodeData: (id, data) => set(s => ({ nodes: s.nodes.map(n => n.id === id ? { ...n, data: { ...n.data, ...data } as WorkflowNodeData } : n) })),
  deleteNode: (id) => set(s => ({ nodes: s.nodes.filter(n => n.id !== id), edges: s.edges.filter(e => e.source !== id && e.target !== id), selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId })),
  addNode: (node) => set(s => ({ nodes: [...s.nodes, node] })),
  setSimulationOpen: (open) => set({ simulationOpen: open }),
  setWorkflowName: (name) => set({ workflowName: name }),
  exportWorkflow: () => { const { nodes, edges, workflowName } = get(); return JSON.stringify({ workflowName, nodes, edges }, null, 2); },
  importWorkflow: (json) => { try { const { workflowName, nodes, edges } = JSON.parse(json); set({ workflowName, nodes, edges, selectedNodeId: null }); } catch(e) { console.error(e); } },
}));
