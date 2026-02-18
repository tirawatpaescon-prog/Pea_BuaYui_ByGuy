
import React from 'react';
import { ElectricityUser } from '../types';

interface ResultCardProps {
  user: ElectricityUser;
  onAddToRoute: (user: ElectricityUser) => void;
  onRemoveFromRoute: (id: string) => void;
  isInRoute: boolean;
  orderNumber?: number;
}

const ResultCard: React.FC<ResultCardProps> = ({ 
  user, 
  onAddToRoute, 
  onRemoveFromRoute, 
  isInRoute,
  orderNumber 
}) => {
  return (
    <div className={`group bg-white rounded-3xl p-5 shadow-sm border transition-all ${
      isInRoute ? 'border-purple-200 bg-purple-50/30' : 'border-slate-100 hover:shadow-md'
    }`}>
      <div className="flex items-start gap-4">
        {/* Selection State Indicator */}
        <button 
          onClick={() => isInRoute ? onRemoveFromRoute(user.id) : onAddToRoute(user)}
          className={`mt-1 w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
            isInRoute 
              ? 'bg-purple-600 text-white shadow-lg' 
              : 'bg-slate-50 text-slate-300 border border-slate-200 group-hover:border-purple-300'
          }`}
        >
          {isInRoute ? (
             orderNumber ? <span className="text-xs font-black">{orderNumber}</span> : '✓'
          ) : '+'}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-800 leading-tight">
                {user.firstName} {user.lastName}
              </h3>
              <div className="flex flex-wrap gap-x-3 mt-0.5">
                <p className="text-xs font-mono text-purple-600 font-bold">CA: {user.caNumber}</p>
                <p className="text-xs font-mono text-blue-600 font-bold">Meter: {user.peaMeter}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                user.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                {user.status}
              </span>
              <p className="text-[10px] font-bold text-slate-400 mt-1">{user.branch}</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-100 rounded-full shadow-sm">
              <span className="text-[10px] text-slate-400">📍</span>
              <span className="text-[10px] font-bold text-slate-600 truncate max-w-[150px]">{user.address}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-100 rounded-full shadow-sm">
              <span className="text-[10px] text-slate-400">⚡</span>
              <span className="text-[10px] font-bold text-slate-600">{user.amperhour} ({user.phase} Phase)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
