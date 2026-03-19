import React from 'react';

const SignalDial = ({ bestDbm }) => {
    // Percent from -115 (0%) to -60 (100%)
    const percent = Math.max(0, Math.min(100, ((bestDbm + 115) / 55) * 100));
    
    // Rotation for needle: -90deg to 90deg
    const rotation = (percent / 100) * 180 - 90;

    const getQualityColor = (dbm) => {
        if (dbm >= -80) return '#00e676';
        if (dbm >= -90) return '#c6ff00';
        if (dbm >= -100) return '#ffea00';
        return '#ff3d00';
    };

    const qColor = getQualityColor(bestDbm);

    return (
        <section className="glass-panel p-10 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="relative w-[320px] h-[200px] flex justify-center items-end overflow-hidden">
                {/* Gauge Background Arc */}
                <svg className="absolute bottom-0 w-full h-[320px]" viewBox="0 0 200 100">
                    <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="12"
                        strokeLinecap="round"
                    />
                    {/* Active Progress Arc */}
                    <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke={qColor}
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray="251.3"
                        strokeDashoffset={251.3 - (251.3 * percent) / 100}
                        className="transition-all duration-1000 ease-out"
                        style={{ filter: `drop-shadow(0 0 12px ${qColor}44)` }}
                    />
                    
                    {/* Ticks */}
                    {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map(p => {
                        const angle = (p / 100) * 180 - 180;
                        const x1 = 100 + 72 * Math.cos((angle * Math.PI) / 180);
                        const y1 = 100 + 72 * Math.sin((angle * Math.PI) / 180);
                        const x2 = 100 + 88 * Math.cos((angle * Math.PI) / 180);
                        const y2 = 100 + 88 * Math.sin((angle * Math.PI) / 180);
                        return (
                            <line key={p} x1={x1} y1={y1} x2={x2} y2={y2} stroke="white" strokeWidth="1" strokeOpacity="0.2" />
                        );
                    })}
                </svg>

                {/* Needle */}
                <div 
                    className="absolute bottom-0 w-1.5 h-32 bg-gradient-to-t from-white/20 to-white rounded-full origin-bottom animate-needle"
                    style={{ 
                        transform: `rotate(${rotation}deg)`,
                        boxShadow: '0 0 15px rgba(255,255,255,0.3)'
                    }}
                ></div>
                
                {/* Center Hub */}
                <div className="absolute bottom-[-10px] w-8 h-8 rounded-full bg-slate-800 border-4 border-white/20 z-10"></div>
            </div>

            <div className="mt-8 text-center">
                <div className="text-6xl font-black nperf-gradient-text tracking-tighter mb-1">
                    {Math.abs(bestDbm)}
                </div>
                <div className="text-sm font-bold text-white/40 uppercase tracking-[0.2em]">dBm Signal Strength</div>
            </div>
            
            {/* Start Test Overlay (Simplified nPerf style) */}
            <button className="mt-10 glass-button text-emerald-400 font-bold hover:text-white hover:border-emerald-500/50 transition-all duration-500">
                START TEST
            </button>
        </section>
    );
};

export default SignalDial;
