import React from 'react';

const TopPredictionsChart = ({ predictions = [] }) => {
  if (!predictions || predictions.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
        Top Alternative Predictions
      </h3>
      <div className="space-y-3.5">
        {predictions.slice(0, 5).map((pred, idx) => {
          const name = pred.className || pred.label || 'Unknown';
          const prob = pred.probability !== undefined ? pred.probability : (pred.confidence || 0);
          
          const pctVal = prob <= 1 ? prob * 100 : prob;
          const percentage = Math.min(Math.max(pctVal, 0), 100).toFixed(2);

          const barColors = [
            'from-indigo-600 to-indigo-500', 
            'from-blue-600 to-blue-500',     
            'from-sky-500 to-sky-400',       
            'from-cyan-500 to-cyan-400',     
            'from-slate-400 to-slate-300'    
          ];

          return (
            <div key={idx} className="group">
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span className="capitalize text-slate-700 group-hover:text-indigo-900 transition-colors">
                  {name.split(',')[0]}
                </span>
                <span className="text-slate-500">{percentage}%</span>
              </div>
              
              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden border border-slate-100/50">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${barColors[idx] || barColors[4]} transition-all duration-1000 ease-out`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TopPredictionsChart;
