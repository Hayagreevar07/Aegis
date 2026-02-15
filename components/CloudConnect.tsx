import React, { useState } from 'react';
import { Cloud, Database, ShieldCheck, AlertCircle, X, Check, Server } from 'lucide-react';
import { StorageService, CloudCredentials } from '../services/storage';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CloudConnect: React.FC<Props> = ({ isOpen, onClose }) => {
  const [creds, setCreds] = useState<CloudCredentials>(StorageService.getCredentials() || { url: '', key: '' });
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (creds.url && creds.key) {
      StorageService.setCredentials(creds);
      setIsSaved(true);
      setTimeout(onClose, 1000);
    }
  };

  const handleDisconnect = () => {
    StorageService.setCredentials(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
              <Cloud className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
                <h2 className="text-lg font-bold text-slate-200">Cloud Infrastructure</h2>
                <p className="text-xs text-slate-500 font-mono uppercase">Connect Supabase Database</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          
          <div className="bg-indigo-900/10 border border-indigo-500/20 rounded-xl p-4">
            <h3 className="text-sm font-bold text-indigo-300 mb-2 flex items-center gap-2">
                <Server className="w-4 h-4" /> BYOB (Bring Your Own Backend)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
                AEGIS operates in "Offline Mode" by default. Connect a <strong>Supabase</strong> project to enable 
                cloud persistence, allowing you to save simulations permanently and access them across devices. 
                Data flows directly from your browser to your database.
            </p>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project URL</label>
                <input 
                    type="text" 
                    value={creds.url}
                    onChange={(e) => setCreds({...creds, url: e.target.value})}
                    placeholder="https://xyz.supabase.co"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
            </div>
            <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Public Anon Key</label>
                <input 
                    type="password" 
                    value={creds.key}
                    onChange={(e) => setCreds({...creds, key: e.target.value})}
                    placeholder="eyJh..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
            </div>
          </div>

          <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-[10px] text-slate-400 overflow-x-auto">
            <div className="flex items-center gap-2 text-slate-300 mb-2 font-bold">
                <Database className="w-3 h-3" />
                REQUIRED DATABASE SCHEMA (SQL)
            </div>
            <pre className="text-emerald-400/80">
{`create table simulations (
  id uuid primary key,
  created_at timestamp with time zone default now(),
  title text not null,
  domain text,
  result jsonb not null
);

-- Enable Row Level Security (Recommended)
alter table simulations enable row level security;
create policy "Public Access" on simulations for all using (true);`}
            </pre>
            <p className="mt-2 text-slate-500 italic">Run this in your Supabase SQL Editor.</p>
          </div>

        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-950/50 flex justify-between items-center">
             {StorageService.isCloudEnabled() ? (
                <button 
                    onClick={handleDisconnect}
                    className="text-xs text-red-400 hover:text-red-300 font-bold tracking-wider hover:underline"
                >
                    DISCONNECT CLOUD
                </button>
             ) : <div />}

            <button 
                onClick={handleSave}
                disabled={!creds.url || !creds.key}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white rounded-lg font-bold text-sm transition-all flex items-center gap-2"
            >
                {isSaved ? <Check className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
                {isSaved ? 'CONNECTED' : 'CONNECT CLOUD'}
            </button>
        </div>

      </div>
    </div>
  );
};