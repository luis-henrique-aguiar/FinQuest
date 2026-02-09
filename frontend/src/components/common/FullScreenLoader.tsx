import React from 'react';
import { Loader2 } from 'lucide-react';

export const FullScreenLoader: React.FC = () => {
  return (
    <div className="fixed inset-0 w-screen h-screen flex items-center justify-center bg-white/90 dark:bg-zinc-950/90 z-[9999] backdrop-blur-sm">
      <div className="relative">
        <div className="absolute inset-0 rounded-full blur-xl bg-blue-500/20" />
        <Loader2 className="w-12 h-12 text-[#007ACC] animate-spin relative z-10" />
      </div>
    </div>
  );
};

export default FullScreenLoader;