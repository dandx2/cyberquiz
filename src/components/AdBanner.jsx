import React from 'react';
import { Megaphone } from 'lucide-react';

const AdBanner = () => {
  return (
    <aside className="w-full lg:w-64 flex-shrink-0 order-first lg:order-last p-4">
      <div className="h-full bg-black/30 backdrop-blur-sm border border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center shadow-lg hover:shadow-purple-500/20 transition-shadow duration-300">
        <Megaphone className="w-12 h-12 text-purple-400 mb-4" />
        <h3 className="text-lg font-bold text-slate-200">Ad Space</h3>
        <p className="text-sm text-slate-400 mt-2">
          This area is reserved for future advertisements.
        </p>
      </div>
    </aside>
  );
};

export default AdBanner;