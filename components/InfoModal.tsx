import React from 'react';
import { X, Mail, Info, Github, Cpu } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
              <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-200">System Information</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* About Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Info className="w-4 h-4" /> About AEGIS
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed text-justify">
              AEGIS is an autonomous physics and logic engine designed to rigorously evaluate concepts before implementation. 
              Powered by Google's Gemini 3 models, it simulates structural integrity, thermodynamic properties, and economic feasibility 
              to predict failure modes and calculate risk scores with high precision.
            </p>
          </div>

          <div className="h-px bg-slate-800" />

          {/* Support Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
              <Mail className="w-4 h-4" /> Support & Contact
            </h3>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex items-center gap-4 group hover:border-cyan-500/30 transition-colors">
              <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors">
                <Mail className="w-5 h-5 text-slate-400 group-hover:text-cyan-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-slate-500 uppercase font-mono mb-1">Direct Support Channel</p>
                <a 
                  href="mailto:hayagreevar2007@gmail.com" 
                  className="text-sm font-bold text-slate-200 hover:text-cyan-400 transition-colors"
                >
                  hayagreevar2007@gmail.com
                </a>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              For technical inquiries, bug reports, or feature requests, please contact the development team directly via email.
            </p>
          </div>

          <div className="h-px bg-slate-800" />
          
          <div className="flex justify-center">
            <p className="text-[10px] text-slate-600 font-mono">
              v2.0.0-beta // Powered by Gemini 3 Pro
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};