import type { NodeType } from '../types/workflow';
export const NODE_COLORS: Record<NodeType, { bg: string; border: string; accent: string }> = {
  start:     { bg: '#0f2d1a', border: '#22c55e', accent: '#22c55e' },
  task:      { bg: '#1a1f2e', border: '#3b82f6', accent: '#3b82f6' },
  approval:  { bg: '#1f1a2e', border: '#a855f7', accent: '#a855f7' },
  automated: { bg: '#2e1f1a', border: '#f97316', accent: '#f97316' },
  end:       { bg: '#2e1a1a', border: '#ef4444', accent: '#ef4444' },
};
export const NODE_LABELS: Record<NodeType, string> = { start:'Start', task:'Task', approval:'Approval', automated:'Automated Step', end:'End' };
export const NODE_DESCRIPTIONS: Record<NodeType, string> = { start:'Workflow entry point', task:'Human task assignment', approval:'Manager approval step', automated:'System-triggered action', end:'Workflow completion' };
export function generateId(): string { return `node_${Date.now()}_${Math.random().toString(36).slice(2,7)}`; }
