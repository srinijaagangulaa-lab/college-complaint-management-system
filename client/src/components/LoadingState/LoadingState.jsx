import React from 'react';

export const LoadingState = ({ message = 'Loading details...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-400 space-y-3">
      <div className="h-9 w-9 rounded-full border-2 border-indigo-500/20 border-t-indigo-500 animate-spin" />
      <p className="text-xs font-medium tracking-wide text-slate-400">{message}</p>
    </div>
  );
};

export default LoadingState;
