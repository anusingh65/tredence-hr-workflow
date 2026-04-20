import { useEffect, useState } from 'react';
import { getAutomations } from '../api/mockApi';
import type { AutomationAction } from '../types/workflow';
export function useAutomations() {
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getAutomations().then(d => { setAutomations(d); setLoading(false); }); }, []);
  return { automations, loading };
}
