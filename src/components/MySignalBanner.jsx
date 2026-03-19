import React, { useState, useEffect } from 'react';
import { Wifi, ChevronDown } from 'lucide-react';

const CARRIERS = [
    { id: 'mtn',         label: 'MTN',      color: '#ffcc00' },
    { id: 'airtel',      label: 'Airtel',   color: '#ff3c3c' },
    { id: 'glo',         label: 'Glo',      color: '#00cc44' },
    { id: 'nine_mobile', label: '9mobile',  color: '#adc808' },
];

const GEN_CONFIG = {
    '5G': { bg: 'bg-purple-100', text: 'text-purple-700', ring: 'ring-purple-300', label: '5G',  desc: 'Ultra-fast 5G', bar: '#7c3aed' },
    '4G': { bg: 'bg-blue-100',   text: 'text-blue-700',   ring: 'ring-blue-300',   label: '4G',  desc: 'Fast 4G LTE',   bar: '#2563eb' },
    '3G': { bg: 'bg-amber-100',  text: 'text-amber-700',  ring: 'ring-amber-300',  label: '3G',  desc: 'Standard 3G',  bar: '#d97706' },
    '2G': { bg: 'bg-red-100',    text: 'text-red-700',    ring: 'ring-red-300',    label: '2G',  desc: 'Basic 2G EDGE', bar: '#dc2626' },
};

const MySignalBanner = ({ networks }) => {
    const saved = localStorage.getItem('myCarrier') || 'mtn';
    const [myCarrier, setMyCarrier] = useState(saved);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('myCarrier', myCarrier);
    }, [myCarrier]);

    const data = networks[myCarrier] || {};
    const gen = data.gen || '4G';
    const g = GEN_CONFIG[gen];
    const carrier = CARRIERS.find(c => c.id === myCarrier);

    const getQualityLabel = (dbm) => {
        if (!dbm) return 'Syncing';
        if (dbm >= -80) return 'Excellent';
        if (dbm >= -90) return 'Good';
        if (dbm >= -100) return 'Fair';
        return 'Weak';
    };

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">
            {/* Header bar with carrier color */}
            <div className="h-1.5 w-full rounded-t-2xl" style={{ backgroundColor: carrier?.color }}></div>

            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center gap-6">

                {/* Left: Icon + label */}
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ring-2 ${g.ring} ${g.bg}`}>
                        <Wifi className={`w-6 h-6 ${g.text}`} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-0.5">My Signal</p>
                        <p className={`text-2xl font-black ${g.text}`}>{g.label}</p>
                        <p className="text-xs text-gray-400 font-medium">{g.desc}</p>
                    </div>
                </div>

                {/* Middle: Stats */}
                <div className="flex gap-6 flex-grow">
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Quality</p>
                        <p className="text-base font-black text-gray-800">{getQualityLabel(data.dbm)}</p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Signal</p>
                        <p className="text-base font-black text-gray-800">{data.dbm ?? '—'} <span className="text-xs font-normal text-gray-400">dBm</span></p>
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Ping</p>
                        <p className="text-base font-black text-gray-800">{data.ping ?? '—'} <span className="text-xs font-normal text-gray-400">ms</span></p>
                    </div>
                </div>

                {/* Right: Carrier selector */}
                <div className="relative ml-auto shrink-0">
                    <button
                        onClick={() => setOpen(prev => !prev)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: carrier?.color }}></span>
                        {carrier?.label}
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`} />
                    </button>

                    {open && (
                        <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-lg z-50 overflow-hidden">
                            {CARRIERS.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => { setMyCarrier(c.id); setOpen(false); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-colors ${myCarrier === c.id ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                                >
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }}></span>
                                    {c.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MySignalBanner;
