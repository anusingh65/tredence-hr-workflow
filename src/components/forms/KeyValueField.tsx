import React from 'react';
import type { KeyValue } from '../../types/workflow';
import { Plus, Trash2 } from 'lucide-react';

export function KeyValueField({ label, pairs, onChange }: { label: string; pairs: KeyValue[]; onChange: (p: KeyValue[]) => void }) {
  const add = () => onChange([...pairs, { key:'', value:'' }]);
  const remove = (i: number) => onChange(pairs.filter((_,idx) => idx!==i));
  const update = (i: number, f: 'key'|'value', v: string) => { const n=[...pairs]; n[i]={...n[i],[f]:v}; onChange(n); };
  const inp = 'flex-1 bg-[#0d0f14] border border-[#252d3d] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-orange-500 transition-colors font-mono';
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{label}</label>
        <button onClick={add} className="flex items-center gap-1 text-xs text-orange-500 hover:text-orange-400"><Plus size={10}/>Add</button>
      </div>
      <div className="space-y-1.5">
        {pairs.map((p,i) => (
          <div key={i} className="flex gap-1.5 items-center">
            <input value={p.key} onChange={e=>update(i,'key',e.target.value)} placeholder="key" className={inp}/>
            <input value={p.value} onChange={e=>update(i,'value',e.target.value)} placeholder="value" className={inp}/>
            <button onClick={()=>remove(i)} className="text-gray-500 hover:text-red-400 transition-colors"><Trash2 size={11}/></button>
          </div>
        ))}
        {pairs.length===0 && <p className="text-xs text-gray-500 italic py-1">No entries yet</p>}
      </div>
    </div>
  );
}
