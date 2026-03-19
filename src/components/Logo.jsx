import React from 'react';

const Logo = ({ className = '', showTagline = true, variant = 'full' }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <div className="relative flex items-end gap-[3px] h-8 w-10 shrink-0">
                {/* Signal Bars (Reversed heights as requested) */}
                <div className="w-1.5 h-[100%] bg-emerald-600 rounded-sm" />
                <div className="w-1.5 h-[75%] bg-emerald-600 rounded-sm opacity-90" />
                <div className="w-1.5 h-[50%] bg-emerald-600 rounded-sm opacity-75" />
                <div className="w-1.5 h-[30%] bg-emerald-600 rounded-sm opacity-60" />
            </div>
            
            {(variant === 'full' || variant === 'text') && (
                <div className="flex flex-col">
                    <span className="text-gray-900 font-black text-2xl tracking-tighter leading-none">
                        Signal Pulse
                    </span>
                    {showTagline && (
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                            Network Health & Quality Monitoring
                        </span>
                    )}
                </div>
            )}
        </div>
    );
};

export default Logo;
