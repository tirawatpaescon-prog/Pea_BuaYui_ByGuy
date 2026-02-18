
import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-[4px] border-purple-200 rounded-full animate-pulse"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 bg-purple-600 rounded-2xl rotate-45 flex items-center justify-center shadow-xl">
            <span className="text-white text-3xl font-black -rotate-45">P</span>
          </div>
        </div>
      </div>
      <div className="mt-4 text-center">
        <h1 className="text-3xl font-black text-slate-800 tracking-tighter">PEA Explorer<span className="text-purple-600">Pro</span></h1>
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Field Intelligence System</p>
      </div>
    </div>
  );
};

export default Logo;
