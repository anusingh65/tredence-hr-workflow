export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';
export interface KeyValue { key: string; value: string; }
export interface StartNodeData { type: 'start'; label: string; metadata: KeyValue[]; }
export interface TaskNodeData { type: 'task'; label: string; description: string; assignee: string; dueDate: string; customFields: KeyValue[]; }
export interface ApprovalNodeData { type: 'approval'; label: string; approverRole: string; autoApproveThreshold: number; }
export interface AutomatedNodeData { type: 'automated'; label: string; actionId: string; actionParams: Record<string, string>; }
export interface EndNodeData { type: 'end'; label: string; endMessage: string; summaryFlag: boolean; }
export type WorkflowNodeData = StartNodeData | TaskNodeData | ApprovalNodeData | AutomatedNodeData | EndNodeData;
export interface AutomationAction { id: string; label: string; params: string[]; }
export interface SimulationStep { nodeId: string; nodeType: NodeType; label: string; status: 'success' | 'warning' | 'error'; message: string; }
export interface SimulationResult { success: boolean; steps: SimulationStep[]; errors: string[]; summary: string; }
