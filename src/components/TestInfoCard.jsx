import React from 'react';
import { ShieldCheck, Zap, WifiOff } from 'lucide-react';

const TestInfoCard = () => {
    const tips = [
        { icon: WifiOff, text: "Stop all active downloads/uploads" },
        { icon: Zap, text: "Prefer wired connections for stability" },
        { icon: ShieldCheck, text: "Disable VPN for more accurate results" }
    ];

    return (
        <div className="glass-panel p-8 h-full flex flex-col">
            <h3 className="text-2xl font-bold mb-6 nperf-gradient-text tracking-tight">How to optimize your tests?</h3>
            <div className="space-y-6 flex-grow">
                {tips.map((tip, i) => (
                    <div key={i} className="flex items-start gap-4 group">
                        <div className="mt-1 p-2 rounded-xl bg-white/5 border border-white/5 group-hover:bg-emerald-500/10 group-hover:border-emerald-500/20 transition-all duration-300">
                            <tip.icon className="w-5 h-5 text-emerald-400" />
                        </div>
                        <p className="text-slate-400 group-hover:text-slate-100 transition-colors duration-300 leading-relaxed font-medium">
                            {tip.text}
                        </p>
                    </div>
                ))}
            </div>
            <p className="mt-8 text-sm text-white/20 italic">
                Repeat the test several times to check stability.
            </p>
        </div>
    );
};

export default TestInfoCard;
