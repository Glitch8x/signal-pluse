import React from 'react';

const GEN_CONFIG = {
    '5G': { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', dot: '#7c3aed' },
    '4G': { bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-200',   dot: '#2563eb' },
    '3G': { bg: 'bg-amber-100',  text: 'text-amber-700',  border: 'border-amber-200',  dot: '#d97706' },
    '2G': { bg: 'bg-red-100',    text: 'text-red-700',    border: 'border-red-200',    dot: '#dc2626' },
};

const NetworkCard = ({ brand, data, towerCount }) => {
    const { dbm, ping, quality, gen = '4G', isReal = false } = data;

    const getQuality = (dbm) => {
        if (dbm >= -80)  return { text: 'Excellent', hex: '#10b981' };
        if (dbm >= -90)  return { text: 'Good',      hex: '#f59e0b' };
        if (dbm >= -100) return { text: 'Fair',       hex: '#f97316' };
        return                  { text: 'Weak',       hex: '#ef4444' };
    };

    const q = getQuality(dbm);
    const g = GEN_CONFIG[gen] || GEN_CONFIG['4G'];

    return (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md">
            {/* Top accent */}
            <div className="absolute top-0 left-0 w-full h-1 rounded-t-2xl transition-colors duration-700" style={{ backgroundColor: q.hex }} />


            {/* Header */}
            <div className="flex justify-between items-start mb-5 mt-1">
                <div>
                    <div className="text-xl font-black tracking-tight text-gray-800 leading-none">{brand}</div>
                    {/* Generation Badge */}
                    <div className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full border text-[11px] font-black uppercase tracking-wider ${g.bg} ${g.text} ${g.border}`}>
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: g.dot }} />
                        {gen}
                    </div>
                </div>
                <div className="text-[10px] font-bold text-gray-400 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full uppercase tracking-tighter mt-1">
                    {ping}ms
                </div>
            </div>

            {/* Signal Bars */}
            <div className="flex items-end gap-1.5 h-12 mb-5">
                {[1, 2, 3, 4, 5].map((bar) => {
                    const isActive = bar <= (quality + 1);
                    return (
                        <div
                            key={bar}
                            className="flex-1 rounded-sm transition-all duration-500 ease-out"
                            style={{
                                height: `${(bar / 5) * 100}%`,
                                backgroundColor: isActive ? q.hex : '#e5e7eb',
                                boxShadow: isActive ? `0 0 8px ${q.hex}55` : 'none',
                            }}
                        />
                    );
                })}
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end">
                <div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-0.5">Signal</span>
                    <span className="font-bold text-sm" style={{ color: q.hex }}>{q.text}</span>
                    {/* Tower count when real data is available */}
                    {isReal && towerCount != null && (
                        <span className="block text-[10px] text-gray-400 font-medium mt-0.5">
                            {towerCount} tower{towerCount !== 1 ? 's' : ''} nearby
                        </span>
                    )}
                </div>
                <span className="text-xs font-mono text-gray-400">{dbm} <span className="text-[10px]">dBm</span></span>
            </div>
        </div>
    );
};

export default NetworkCard;
