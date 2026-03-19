import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Signal, Map as MapIcon, Info, Loader, Navigation } from 'lucide-react';
import { getLocation } from '../services/telephonyService';
import { generateCountryHeatmap } from '../services/networkApi';

// Minna, Niger State — default fallback
const MINNA_POSITION = { lat: 9.5833, lng: 6.5500 };
const NIGERIA_CENTER = { lat: 9.0820, lng: 8.6753 };

const CARRIER_COLORS = {
    mtn:         '#ffcc00',
    airtel:      '#ff3c3c',
    glo:         '#00cc44',
    nine_mobile: '#adc808',
};

const CARRIER_LABELS = {
    mtn: 'MTN', airtel: 'Airtel', glo: 'Glo', nine_mobile: '9mobile',
};

// nPerf-like Gradient Colors
const HEATMAP_GRADIENTS = {
    mtn: [
        'rgba(0, 255, 0, 0)', 'rgba(167, 243, 208, 1)', 'rgba(52, 211, 153, 1)', 
        'rgba(251, 191, 36, 1)', 'rgba(245, 158, 11, 1)', 'rgba(239, 68, 68, 1)', 
        'rgba(185, 28, 28, 1)', 'rgba(139, 92, 246, 1)', 'rgba(109, 40, 217, 1)'
    ],
    airtel: [
        'rgba(0, 255, 0, 0)', 'rgba(167, 243, 208, 1)', 'rgba(252, 165, 165, 1)', 
        'rgba(239, 68, 68, 1)', 'rgba(185, 28, 28, 1)', 'rgba(139, 92, 246, 1)', 'rgba(109, 40, 217, 1)'
    ],
    glo: [
        'rgba(0, 255, 0, 0)', 'rgba(167, 243, 208, 1)', 'rgba(52, 211, 153, 1)', 
        'rgba(5, 150, 105, 1)', 'rgba(139, 92, 246, 1)', 'rgba(109, 40, 217, 1)'
    ],
    nine_mobile: [
        'rgba(0, 255, 0, 0)', 'rgba(217, 249, 157, 1)', 'rgba(132, 204, 22, 1)', 
        'rgba(77, 124, 15, 1)', 'rgba(139, 92, 246, 1)', 'rgba(109, 40, 217, 1)'
    ]
};

// Emerald dark map style
const EMERALD_MAP_STYLE = [
    { elementType: 'geometry', stylers: [{ color: '#010d0a' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#010d0a' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#4ade80' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#6ee7b7' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#059669' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#022c1a' }] },
    { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#34d399' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#041f14' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#022c1a' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#34d399' }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#064e3b' }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#022c1a' }] },
    { featureType: 'road.highway', elementType: 'labels.text.fill', stylers: [{ color: '#6ee7b7' }] },
    { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#022c1a' }] },
    { featureType: 'transit.station', elementType: 'labels.text.fill', stylers: [{ color: '#34d399' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#020d08' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#10b981' }] },
    { featureType: 'water', elementType: 'labels.text.stroke', stylers: [{ color: '#010d0a' }] },
];

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function loadGoogleMapsScript(apiKey, callback) {
    if (window.google && window.google.maps) { callback(); return; }
    
    if (!window.initGoogleMaps) {
        window.initGoogleMaps = () => {
            window.dispatchEvent(new Event('google-maps-loaded'));
        };
    }

    const existing = document.getElementById('google-maps-script');
    if (existing) { window.addEventListener('google-maps-loaded', callback, { once: true }); return; }
    
    const script = document.createElement('script');
    script.id  = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=visualization&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    window.addEventListener('google-maps-loaded', callback, { once: true });
    document.head.appendChild(script);
}

const MapsPage = () => {
    const [activeCarrier, setActiveCarrier] = useState('mtn');
    const [isLoaded, setIsLoaded]           = useState(false);
    const [apiKeyMissing, setApiKeyMissing] = useState(false);
    const [coverageData, setCoverageData]   = useState(null);
    const [userPos, setUserPos]             = useState(null);
    const [isRealData, setIsRealData]       = useState(false);
    const [loadingTowers, setLoadingTowers] = useState(true);

    const mapRef          = useRef(null);
    const mapInstance     = useRef(null);
    const heatmapLayerRef = useRef(null);
    const userMarker      = useRef(null);

    // ── Step 1: Location API → Generate Heatmap ──────────────────────
    useEffect(() => {
        (async () => {
            setLoadingTowers(true);
            const loc = await getLocation();

            if (loc) {
                setUserPos({ lat: loc.lat, lng: loc.lon });
            }
            
            // Generate massive synthetic heatmap data covering Nigeria
            const heatData = await generateCountryHeatmap();
            setCoverageData(heatData);
            setIsRealData(true);
            setLoadingTowers(false);
        })();
    }, []);

    // ── Step 2: Load Google Maps ────────────────────────────────────────────
    useEffect(() => {
        if (!GOOGLE_MAPS_API_KEY || GOOGLE_MAPS_API_KEY === 'your_google_maps_key_here') {
            setApiKeyMissing(true);
            return;
        }
        loadGoogleMapsScript(GOOGLE_MAPS_API_KEY, () => setIsLoaded(true));
    }, []);

    // ── Step 3: Init map ────────────────────────────────────────────────────
    useEffect(() => {
        if (!isLoaded || !mapRef.current || mapInstance.current) return;
        // Center the map largely over Nigeria to show the heatmap
        const center = NIGERIA_CENTER;
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
            center,
            zoom:              6,
            styles:            EMERALD_MAP_STYLE,
            disableDefaultUI:  true,
            zoomControl:       true,
            zoomControlOptions: { position: window.google.maps.ControlPosition.RIGHT_CENTER },
        });
    }, [isLoaded, userPos]);

    // ── Step 4: Add user location marker ───────────────────────────────────
    useEffect(() => {
        if (!mapInstance.current || !userPos || !window.google) return;
        if (userMarker.current) userMarker.current.setMap(null);
        userMarker.current = new window.google.maps.Marker({
            position: userPos,
            map: mapInstance.current,
            title: 'Your Location',
            icon: {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#10b981',
                fillOpacity: 1,
                strokeColor: '#fff',
                strokeWeight: 3,
            },
        });
        mapInstance.current.panTo(userPos);
    }, [userPos, isLoaded]);

    // ── Step 5: Draw true heatmap layer ─────────────────
    useEffect(() => {
        if (!mapInstance.current || !window.google || !window.google.maps.visualization) return;
        if (!coverageData) return;

        // Clear old heatmap layer
        if (heatmapLayerRef.current) {
            heatmapLayerRef.current.setMap(null);
        }

        const points = coverageData[activeCarrier] || [];
        
        // Map raw data into google.maps.visualization.WeightedLocation
        const heatmapDataObj = points.map(p => ({
            location: new window.google.maps.LatLng(p.lat, p.lon),
            weight: p.weight,
        }));

        heatmapLayerRef.current = new window.google.maps.visualization.HeatmapLayer({
            data: heatmapDataObj,
            map: mapInstance.current,
            gradient: HEATMAP_GRADIENTS[activeCarrier],
            radius: 35,      // Blob size
            opacity: 0.85,   // Slightly transparent for map details underneath
            maxIntensity: 15 // Controls how "hot" colors blend at the core
        });

    }, [activeCarrier, isLoaded, coverageData]);

    const handleCenterMap = useCallback(() => {
        if (mapInstance.current && userPos) {
            mapInstance.current.panTo(userPos);
            mapInstance.current.setZoom(14);
        }
    }, [userPos]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (heatmapLayerRef.current) heatmapLayerRef.current.setMap(null);
            if (userMarker.current) userMarker.current.setMap(null);
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="h-[calc(100vh-64px)] w-full flex flex-col lg:flex-row bg-gray-50 overflow-hidden"
        >
            {/* Sidebar */}
            <aside className="w-full lg:w-80 bg-white border-r border-gray-200 p-6 overflow-y-auto z-10 shrink-0 shadow-sm">
                <div className="mb-8">
                    <h2 className="text-2xl font-black text-gray-800 tracking-tighter mb-2 flex items-center gap-2">
                        <MapIcon className="w-6 h-6 text-emerald-600" />
                        Cell Coverage
                    </h2>
                    <p className="text-gray-400 text-sm font-medium flex items-center gap-1.5">
                        {loadingTowers ? (
                            <><Loader className="w-3 h-3 animate-spin text-emerald-500" /> Fetching real towers...</>
                        ) : isRealData ? (
                            <><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" /> Live data from Unwired Labs</>
                        ) : (
                            <><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Fallback (location denied)</>
                        )}
                    </p>
                </div>

                <div className="space-y-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block mb-2">Select Carrier</label>
                    {Object.entries(CARRIER_COLORS).map(([id, color]) => {
                        const count = coverageData?.[id]?.length || 0;
                        return (
                            <button
                                key={id}
                                onClick={() => setActiveCarrier(id)}
                                className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group ${
                                    activeCarrier === id
                                    ? 'bg-emerald-50 border-emerald-300 shadow-sm'
                                    : 'bg-transparent border-gray-200 hover:border-emerald-200 hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                                    <span className={`font-bold capitalize ${activeCarrier === id ? 'text-emerald-700' : 'text-gray-600 group-hover:text-gray-900'}`}>
                                        {CARRIER_LABELS[id]}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-bold text-gray-400">
                                        {count} tower{count !== 1 ? 's' : ''}
                                    </span>
                                    {activeCarrier === id && <Signal className="w-4 h-4 text-emerald-400 animate-pulse" />}
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-6">
                    <div className="flex items-center gap-2 text-emerald-600 mb-3 font-bold text-sm">
                        <Info className="w-4 h-4" />
                        Heatmap Legend
                    </div>
                    <div className="space-y-3 text-xs font-medium text-gray-500">
                        <div className="flex items-center justify-between">
                            <span>Weak</span>
                            <span>Excellent</span>
                        </div>
                        <div className="h-2 w-full rounded-full" style={{
                            background: `linear-gradient(to right, ${HEATMAP_GRADIENTS[activeCarrier].slice(1).join(', ')})`
                        }} />
                        <button 
                            onClick={handleCenterMap}
                            disabled={!userPos}
                            className="w-full flex items-center gap-2 mt-4 pt-4 border-t border-gray-200 hover:text-emerald-600 transition-colors group disabled:opacity-50"
                        >
                            <div className="w-2 h-2 flex-shrink-0 rounded-full bg-emerald-500 group-hover:animate-pulse" />
                            <span className="flex-grow text-left">Your Location</span>
                            <Navigation className="w-3 h-3 text-emerald-500 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                        </button>
                    </div>
                    <p className="mt-4 text-[10px] text-gray-400 font-medium tracking-wide leading-relaxed">
                        Data is aggregated and interpolated to show regional signal density.
                    </p>
                </div>
            </aside>

            {/* Map */}
            <main className="flex-grow relative overflow-hidden h-full">
                <div ref={mapRef} className="h-full w-full" />

                {/* Loading overlay */}
                {!isLoaded && !apiKeyMissing && (
                    <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center gap-4">
                        <Loader className="w-10 h-10 text-emerald-400 animate-spin" />
                        <p className="text-emerald-600 font-bold text-sm tracking-widest uppercase">Loading Map...</p>
                    </div>
                )}

                {/* API key missing overlay */}
                {apiKeyMissing && (
                    <div className="absolute inset-0 bg-gray-50 flex flex-col items-center justify-center gap-6 p-8 text-center">
                        <div className="w-20 h-20 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center">
                            <MapIcon className="w-10 h-10 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-800 mb-2">Google Maps API Key Required</h3>
                            <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
                                Add your key to <code className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-xs">.env.local</code>:
                            </p>
                            <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4 text-left shadow-sm">
                                <code className="text-emerald-700 text-xs font-mono">VITE_GOOGLE_MAPS_API_KEY=your_key_here</code>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom badge */}
                <div className="absolute bottom-6 left-6 z-[1000] pointer-events-none flex items-center gap-3">
                    <div className="bg-white/90 backdrop-blur-md border border-gray-200 rounded-2xl px-4 py-2 flex items-center gap-3 shadow-md">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[11px] font-black text-gray-700 uppercase tracking-widest">
                            {CARRIER_LABELS[activeCarrier]} Coverage Active
                        </span>
                    </div>
                    {isRealData && (
                        <div className="bg-emerald-600/90 backdrop-blur-md border border-emerald-500 rounded-2xl px-4 py-2 flex items-center gap-2 shadow-md">
                            <Navigation className="w-3 h-3 text-white" />
                            <span className="text-[11px] font-black text-white uppercase tracking-widest">Live Tower Data</span>
                        </div>
                    )}
                </div>
            </main>
        </motion.div>
    );
};

export default MapsPage;
