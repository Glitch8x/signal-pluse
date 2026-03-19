import React, { useState, useEffect } from 'react';
import { Wifi, MapPin, Radio, Zap, AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';

/**
 * TelephonyPanel
 * Shows a live readout of all 3 APIs:
 *   - Location API (GPS coordinates + accuracy)
 *   - Telephony / Network Information API (connection type, speed, RTT)
 *   - Unwired Labs Celld API (tower count per carrier)
 */
const TelephonyPanel = ({ telephony, location, towerCounts, onRetryLocation }) => {
    const [permState, setPermState] = useState('prompt'); // 'granted' | 'denied' | 'prompt'

    useEffect(() => {
        if (!navigator.permissions) return;
        navigator.permissions.query({ name: 'geolocation' }).then(result => {
            setPermState(result.state);
            result.onchange = () => setPermState(result.state);
        }).catch(() => {});
    }, [location]);

    const typeColor = {
        cellular: 'text-blue-600 bg-blue-50 border-blue-200',
        wifi:     'text-emerald-600 bg-emerald-50 border-emerald-200',
        ethernet: 'text-purple-600 bg-purple-50 border-purple-200',
        none:     'text-red-600 bg-red-50 border-red-200',
        unknown:  'text-gray-500 bg-gray-100 border-gray-200',
    }[telephony?.type || 'unknown'];

    const totalTowers = towerCounts
        ? Object.values(towerCounts).reduce((a, b) => a + b, 0)
        : null;

    return (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Radio className="w-4 h-4 text-emerald-600" />
                    <h3 className="text-sm font-black text-gray-700 uppercase tracking-widest">API Status</h3>
                </div>
                <div className="flex gap-2">
                    {/* Location API status */}
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                        location ? 'text-emerald-700 bg-emerald-50 border-emerald-300' : 'text-amber-600 bg-amber-50 border-amber-200'
                    }`}>
                        {location ? '📍 Located' : '📍 No GPS'}
                    </span>
                    {/* Unwired Labs status */}
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border uppercase tracking-wider ${
                        totalTowers != null ? 'text-emerald-700 bg-emerald-50 border-emerald-300' : 'text-amber-600 bg-amber-50 border-amber-200'
                    }`}>
                        {totalTowers != null ? `🗼 ${totalTowers} towers` : '🗼 Sim'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">

                {/* ── 1. Location API ── */}
                <div className="px-6 py-5">
                    <div className="flex items-center gap-2 mb-3">
                        <MapPin className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.18em]">Location API</span>
                    </div>
                    {location ? (
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-gray-800 font-mono">{location.lat.toFixed(5)}°N</p>
                            <p className="text-sm font-bold text-gray-800 font-mono">{location.lon.toFixed(5)}°E</p>
                            <p className="text-[11px] text-gray-400 mt-1">±{location.accuracy}m accuracy</p>
                        </div>
                    ) : permState === 'denied' ? (
                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-red-500 text-xs font-bold">
                                <AlertCircle className="w-3.5 h-3.5" />
                                Blocked by browser
                            </div>
                            <p className="text-[10px] text-gray-400 leading-relaxed">
                                Click the <strong>🔒 lock icon</strong> in the address bar → Site settings → Location → <strong>Allow</strong>
                            </p>
                            <button
                                onClick={() => window.open('chrome://settings/content/location', '_blank')}
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 hover:text-emerald-700 underline"
                            >
                                <ExternalLink className="w-3 h-3" />
                                Open browser settings
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-amber-500 text-xs font-semibold">
                                <AlertCircle className="w-3.5 h-3.5" />
                                Not yet granted
                            </div>
                            <button
                                onClick={onRetryLocation}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black transition-colors"
                            >
                                <RefreshCw className="w-3 h-3" />
                                Allow Location
                            </button>
                        </div>
                    )}
                </div>

                {/* ── 2. Telephony / Network Information API ── */}
                <div className="px-6 py-5">
                    <div className="flex items-center gap-2 mb-3">
                        <Wifi className="w-4 h-4 text-blue-500" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.18em]">Telephony API</span>
                    </div>
                    {telephony?.supported ? (
                        <div className="space-y-2">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-black uppercase ${typeColor}`}>
                                {telephony.type}
                            </span>
                            <div className="flex gap-4 mt-2">
                                <div>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Speed</p>
                                    <p className="text-sm font-black text-gray-800">{telephony.downlink ?? '—'} <span className="text-[10px] font-normal text-gray-400">Mbps</span></p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">RTT</p>
                                    <p className="text-sm font-black text-gray-800">{telephony.rtt ?? '—'} <span className="text-[10px] font-normal text-gray-400">ms</span></p>
                                </div>
                                <div>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Type</p>
                                    <p className="text-sm font-black text-gray-800">{telephony.effectiveType?.toUpperCase() ?? '—'}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 text-amber-500 text-xs font-semibold">
                            <AlertCircle className="w-3.5 h-3.5" />
                            Not supported in this browser
                        </div>
                    )}
                </div>

                {/* ── 3. Unwired Labs Celld API ── */}
                <div className="px-6 py-5">
                    <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.18em]">Celld API</span>
                    </div>
                    {towerCounts ? (
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-1 mb-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
                                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">GPS-Anchored</span>
                            </div>
                            {Object.entries(towerCounts).map(([key, count]) => (
                                <div key={key} className="flex justify-between items-center">
                                    <span className="text-[11px] font-bold text-gray-500 uppercase">
                                        {key === 'nine_mobile' ? '9mobile' : key.toUpperCase()}
                                    </span>
                                    <span className="text-[11px] font-black text-gray-800">
                                        {count} tower{count !== 1 ? 's' : ''}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-1.5 text-amber-500 text-xs font-semibold">
                                <AlertCircle className="w-3.5 h-3.5" />
                                Awaiting location
                            </div>
                            <p className="text-[10px] text-gray-400 leading-relaxed">
                                Grant location access to generate real GPS-anchored tower data.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TelephonyPanel;
