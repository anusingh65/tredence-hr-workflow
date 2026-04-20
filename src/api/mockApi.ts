import type { AutomationAction, SimulationResult, SimulationStep } from '../types/workflow';
import type { Node, Edge } from 'reactflow';
import type { WorkflowNodeData, NodeType } from '../types/workflow';

const MOCK_AUTOMATIONS: AutomationAction[] = [
  { id: 'send_email',      label: 'Send Email',           params: ['to','subject','body'] },
  { id: 'generate_doc',    label: 'Generate Document',    params: ['template','recipient'] },
  { id: 'slack_notify',    label: 'Slack Notification',   params: ['channel','message'] },
  { id: 'create_ticket',   label: 'Create JIRA Ticket',   params: ['project','summary','priority'] },
  { id: 'update_hrms',     label: 'Update HRMS Record',   params: ['employee_id','field','value'] },
  { id: 'schedule_meeting',label: 'Schedule Meeting',     params: ['attendees','title','duration'] },
];

export async function getAutomations(): Promise<AutomationAction[]> {
  await delay(300); return MOCK_AUTOMATIONS;
}

export async function simulateWorkflow(nodes: Node<WorkflowNodeData>[], edges: Edge[]): Promise<SimulationResult> {
  await delay(600);
  const errors: string[] = [];
  const startNodes = nodes.filter(n => n.data.type === 'start');
  const endNodes   = nodes.filter(n => n.data.type === 'end');
  if (startNodes.length === 0) errors.push('Workflow must have a Start node');
  if (startNodes.length > 1)   errors.push('Workflow can only have one Start node');
  if (endNodes.length === 0)   errors.push('Workflow must have an End node');
  if (hasCycle(nodes, edges))  errors.push('Workflow contains a cycle — remove circular connections');
  const connected = new Set<string>();
  edges.forEach(e => { connected.add(e.source); connected.add(e.target); });
  const disconnected = nodes.filter(n => n.data.type !== 'start' && !connected.has(n.id));
  if (disconnected.length) errors.push(`Disconnected nodes: ${disconnected.map(n=>n.data.label).join(', ')}`);
  if (errors.length) return { success: false, steps: [], errors, summary: 'Validation failed.' };
  const ordered = topologicalSort(nodes, edges);
  const steps: SimulationStep[] = ordered.map((node, i) => simulateNode(node));
  return { success: true, steps, errors: [], summary: `Executed ${steps.length} steps successfully.` };
}

function simulateNode(node: Node<WorkflowNodeData>): SimulationStep {
  const base = { nodeId: node.id, nodeType: node.data.type as NodeType, label: node.data.label, status: 'success' as const };
  switch (node.data.type) {
    case 'start':     return { ...base, message: `Workflow initiated: "${node.data.label}"` };
    case 'task':      return { ...base, message: `Task assigned to ${node.data.assignee || 'unassigned'} — due ${node.data.dueDate || 'no date'}` };
    case 'approval':  return { ...base, message: `Approval from ${node.data.approverRole} (threshold: ${node.data.autoApproveThreshold})` };
    case 'automated': return { ...base, message: `Action "${node.data.actionId}" triggered` };
    case 'end':       return { ...base, message: node.data.endMessage || 'Workflow completed.' };
    default:          return { ...base, status: 'warning', message: 'Unknown node type' };
  }
}

function hasCycle(nodes: Node[], edges: Edge[]): boolean {
  const adj: Record<string,string[]> = {};
  nodes.forEach(n => (adj[n.id] = []));
  edges.forEach(e => adj[e.source]?.push(e.target));
  const visited = new Set<string>(), inStack = new Set<string>();
  function dfs(id: string): boolean {
    visited.add(id); inStack.add(id);
    for (const nb of adj[id]||[]) { if (!visited.has(nb) && dfs(nb)) return true; if (inStack.has(nb)) return true; }
    inStack.delete(id); return false;
  }
  for (const n of nodes) if (!visited.has(n.id) && dfs(n.id)) return true;
  return false;
}

function topologicalSort(nodes: Node[], edges: Edge[]): Node[] {
  const adj: Record<string,string[]> = {}, deg: Record<string,number> = {};
  nodes.forEach(n => { adj[n.id]=[]; deg[n.id]=0; });
  edges.forEach(e => { adj[e.source].push(e.target); deg[e.target]=(deg[e.target]||0)+1; });
  const q = nodes.filter(n => deg[n.id]===0), res: Node[] = [];
  while (q.length) {
    const node = q.shift()!; res.push(node);
    for (const nb of adj[node.id]) { deg[nb]--; if (deg[nb]===0) { const n=nodes.find(x=>x.id===nb); if(n) q.push(n); } }
  }
  return res;
}

function delay(ms: number) { return new Promise(r => setTimeout(r, ms)); }
