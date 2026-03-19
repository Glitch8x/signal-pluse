import { useState, useEffect, useRef } from 'react';
import {
    getLocation,
    getTelephonyInfo,
    onTelephonyChange,
    fetchNearbyTowers,
    getBestSignal,
} from '../services/telephonyService';

const randomRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getGeneration = (key, dbm) => {
    if (key === 'mtn') {
        if (dbm >= -70) return '5G';
        if (dbm >= -82) return '4G';
        if (dbm >= -95) return '3G';
        return '2G';
    }
    if (key === 'airtel') {
        if (dbm >= -72) return '5G';
        if (dbm >= -84) return '4G';
        if (dbm >= -98) return '3G';
        return '2G';
    }
    if (key === 'glo') {
        if (dbm >= -82) return '4G';
        if (dbm >= -96) return '3G';
        return '2G';
    }
    if (dbm >= -80) return '4G';
    if (dbm >= -95) return '3G';
    return '2G';
};

const DEFAULT_NETWORKS = {
    mtn:         { dbm: -75,  ping: 32, quality: 4, trend: 0, isReal: false, gen: '4G' },
    airtel:      { dbm: -88,  ping: 45, quality: 3, trend: 0, isReal: false, gen: '3G' },
    glo:         { dbm: -105, ping: 68, quality: 2, trend: 0, isReal: false, gen: '2G' },
    nine_mobile: { dbm: -92,  ping: 52, quality: 3, trend: 0, isReal: false, gen: '3G' },
};

export function useSignalSim() {
    const [networks, setNetworks]             = useState(DEFAULT_NETWORKS);
    const [bestNetwork, setBestNetwork]       = useState('MTN');
    const [bestDbm, setBestDbm]               = useState(-75);
    const [connectionType, setConnectionType] = useState('Simulation Mode');
    const [location, setLocation]             = useState(null);
    const [towerData, setTowerData]           = useState(null);
    const [telephony, setTelephony]           = useState(() => getTelephonyInfo());
    const [locationTrigger, setLocationTrigger] = useState(0); // increment to retry

    // expose a retry function for UI
    const retryLocation = () => setLocationTrigger(t => t + 1);

    // ── 1. Boot (or retry): Location API → Tower Data ────────────────────
    useEffect(() => {
        (async () => {
            // a) Read telephony first (sync)
            setTelephony(getTelephonyInfo());

            // b) Get GPS from Location API — this triggers the browser prompt
            const loc = await getLocation();

            if (!loc) {
                setConnectionType('Simulation Mode');
                return;
            }

            setLocation(loc);

            // c) Generate GPS-anchored tower data around the real position
            const towers = await fetchNearbyTowers(loc.lat, loc.lon);

            if (towers) {
                setTowerData(towers);

                setNetworks(prev => {
                    const updated = { ...prev };
                    Object.keys(towers).forEach(key => {
                        const dbm = Math.round(getBestSignal(towers[key]));
                        updated[key] = {
                            ...updated[key],
                            dbm,
                            isReal: true,
                            gen: getGeneration(key, dbm),
                        };
                    });
                    return updated;
                });

                setConnectionType('GPS Tower Data');
            } else {
                setConnectionType('Simulation Mode');
            }
        })();
    }, [locationTrigger]); // re-runs when user clicks "Allow Location"

    // ── 2. Subscribe to Telephony API changes ─────────────────────────────
    useEffect(() => {
        const unsub = onTelephonyChange((info) => {
            setTelephony(info);
        });
        return unsub;
    }, []);

    // ── 3. Tick: fluctuation ──────────────────────────────────────────────
    useEffect(() => {
        const interval = setInterval(() => {
            setNetworks(prev => {
                const next     = { ...prev };
                let topDbm     = -200;
                let topCarrier = 'MTN';

                Object.keys(next).forEach(key => {
                    let data = { ...next[key] };

                    if (data.isReal) {
                        // Real: tiny ±0.5 dBm jitter
                        data.dbm += (Math.random() - 0.5) * 1;
                        data.dbm  = Math.round(data.dbm);
                    } else {
                        // Sim: random walk
                        data.trend += (Math.random() - 0.5) * 1.5;
                        data.trend  = Math.max(Math.min(data.trend, 2), -2);
                        data.dbm   += data.trend;
                        if (key === 'mtn')         data.dbm = Math.max(Math.min(data.dbm, -60), -95);
                        if (key === 'airtel')       data.dbm = Math.max(Math.min(data.dbm, -70), -105);
                        if (key === 'glo')          data.dbm = Math.max(Math.min(data.dbm, -80), -115);
                        if (key === 'nine_mobile')  data.dbm = Math.max(Math.min(data.dbm, -75), -110);
                        data.dbm = Math.round(data.dbm);
                    }

                    data.ping = Math.round(Math.abs(data.dbm) * 0.5 + randomRange(-5, 5));
                    data.gen  = getGeneration(key, data.dbm);

                    if      (data.dbm >= -80)  data.quality = 4;
                    else if (data.dbm >= -90)  data.quality = 3;
                    else if (data.dbm >= -100) data.quality = 2;
                    else                       data.quality = 1;

                    next[key] = data;

                    if (data.dbm > topDbm) {
                        topDbm     = data.dbm;
                        topCarrier = key.toUpperCase().replace('_', ' ');
                    }
                });

                setBestDbm(topDbm);
                setBestNetwork(topCarrier);
                return next;
            });
        }, 1200);

        return () => clearInterval(interval);
    }, []);

    const towerCounts = towerData
        ? Object.fromEntries(Object.entries(towerData).map(([k, v]) => [k, v.length]))
        : null;

    return {
        networks,
        bestNetwork,
        bestDbm,
        connectionType,
        location,
        towerCounts,
        towerData,
        telephony,
        retryLocation,  // ← call this to re-prompt for GPS
    };
}
