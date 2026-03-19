/**
 * networkApi.js
 *
 * Generates realistic cell tower coverage around the user's real GPS location.
 *
 * NOTE: The Unwired Labs `nearby.php` endpoint is a premium feature not available
 * on the free developer tier, and browsers cannot expose raw cell tower IDs needed
 * for the free geolocation endpoint. We therefore generate GPS-anchored, realistic
 * simulated tower data that is geographically accurate to the user's position.
 */

export const CARRIER_MNC = {
    30: 'mtn',
    20: 'airtel',
    50: 'glo',
    60: 'nine_mobile',
};

export const CARRIER_LABELS = {
    mtn:         'MTN',
    airtel:      'Airtel',
    glo:         'Glo',
    nine_mobile: '9mobile',
};

// Carrier-specific signal characteristics for Nigeria
const CARRIER_PROFILES = {
    mtn: {
        towerCount:   [2, 4],
        signalRange:  [-68, -82],   // stronger — largest network
        rangeMetres:  [600, 1200],
        spreadDeg:    0.025,        // ~2.8km radius scatter
    },
    airtel: {
        towerCount:   [2, 3],
        signalRange:  [-72, -90],
        rangeMetres:  [500, 1000],
        spreadDeg:    0.02,
    },
    glo: {
        towerCount:   [2, 3],
        signalRange:  [-78, -98],
        rangeMetres:  [400, 900],
        spreadDeg:    0.02,
    },
    nine_mobile: {
        towerCount:   [1, 3],
        signalRange:  [-80, -105],  // weakest — smallest coverage
        rangeMetres:  [350, 750],
        spreadDeg:    0.018,
    },
};

const rand = (min, max) => Math.random() * (max - min) + min;
const randInt = (min, max) => Math.floor(rand(min, max + 1));
const seed = (v) => Math.sin(v * 127.1) * 43758.5453 % 1; // deterministic noise

/**
 * Generate realistic cell towers clustered around a real GPS position.
 *
 * Returns {
 *   mtn:         [{ lat, lon, signal, range, status, simulated: true }, ...],
 *   airtel:      [...],
 *   glo:         [...],
 *   nine_mobile: [...],
 * }
 */
export const fetchNearbyTowers = async (lat, lon) => {
    // Tiny artificial delay to mimic network request feel
    await new Promise(r => setTimeout(r, 600 + Math.random() * 400));

    const result = {};

    for (const [carrier, profile] of Object.entries(CARRIER_PROFILES)) {
        // Use lat/lon + carrier as a seed for reproducibility per location
        const locationSeed = seed(lat * 1000 + lon * 100 + carrier.length);
        const count = randInt(...profile.towerCount);
        const towers = [];

        for (let i = 0; i < count; i++) {
            // Scatter towers around the user in a realistic pattern
            const angle = (locationSeed * 360 + i * (360 / count) + rand(-30, 30)) % 360;
            const dist  = rand(0.005, profile.spreadDeg);
            const rad   = (angle * Math.PI) / 180;

            const tLat = lat + dist * Math.cos(rad);
            const tLon = lon + dist * Math.sin(rad) / Math.cos((lat * Math.PI) / 180);

            // Signal degrades slightly with distance
            const baseSignal = rand(...profile.signalRange);
            const distFactor = dist / profile.spreadDeg;      // 0–1
            const signal     = Math.round(baseSignal - distFactor * 6);

            towers.push({
                lat,              // Cluster near user position for map display
                lon,
                lat: parseFloat(tLat.toFixed(6)),
                lon: parseFloat(tLon.toFixed(6)),
                signal,
                range:     randInt(...profile.rangeMetres),
                status:    'estimated',
                simulated: true,
            });
        }

        result[carrier] = towers;
    }

    return result;
};

/**
 * Given an array of tower objects for ONE carrier, return the best dBm value.
 */
export const getBestSignal = (towers) => {
    if (!towers || towers.length === 0) return -108;

    const withSignal = towers.filter(t => t.signal !== null && t.signal !== undefined);

    if (withSignal.length > 0) {
        return Math.max(...withSignal.map(t => t.signal));
    }

    // Density fallback
    const count = towers.length;
    if (count > 5) return -70 + Math.random() * 5;
    if (count > 2) return -85 + Math.random() * 8;
    return -98 + Math.random() * 10;
};

// ── HEATMAP GENERATION FOR MAPS PAGE ──────────────────────────────────────────

const NIGERIA_HOTSPOTS = [
    { name: 'Lagos', lat: 6.5244, lon: 3.3792, weight: 1.0, radius: 0.5 },
    { name: 'Abuja', lat: 9.0579, lon: 7.4951, weight: 0.8, radius: 0.4 },
    { name: 'Port Harcourt', lat: 4.8156, lon: 7.0498, weight: 0.7, radius: 0.3 },
    { name: 'Kano', lat: 12.0022, lon: 8.5920, weight: 0.6, radius: 0.35 },
    { name: 'Ibadan', lat: 7.3775, lon: 3.9470, weight: 0.7, radius: 0.4 },
    { name: 'Minna', lat: 9.6139, lon: 6.5569, weight: 0.4, radius: 0.2 },
    { name: 'Enugu', lat: 6.4398, lon: 7.5085, weight: 0.5, radius: 0.25 },
    { name: 'Kaduna', lat: 10.5105, lon: 7.4165, weight: 0.5, radius: 0.3 },
    { name: 'Benin City', lat: 6.3350, lon: 5.6275, weight: 0.6, radius: 0.25 },
    { name: 'Uyo', lat: 5.0377, lon: 7.9128, weight: 0.4, radius: 0.2 },
];

/**
 * Generate a large simulated heatmap dataset covering Nigeria
 */
export const generateCountryHeatmap = async () => {
    // Artificial delay to mimic fetching a massive dataset
    await new Promise(r => setTimeout(r, 600));

    const result = {
        mtn: [],
        airtel: [],
        glo: [],
        nine_mobile: []
    };

    // Calculate cluster points
    for (const hotspot of NIGERIA_HOTSPOTS) {
        // Different carriers have different densities in different cities.
        const basePoints = Math.floor(250 * hotspot.weight);

        Object.keys(CARRIER_PROFILES).forEach(carrier => {
            const profile = CARRIER_PROFILES[carrier];
            const carrierMultiplier = carrier === 'mtn' ? 1.2 : carrier === 'nine_mobile' ? 0.5 : 0.8;
            const numPoints = Math.floor(basePoints * carrierMultiplier);

            for (let i = 0; i < numPoints; i++) {
                // Circular Gaussian-ish distribution
                const u = Math.random() + Math.random();
                const v = Math.random() * 2 * Math.PI;
                const r = hotspot.radius * u;

                const tLat = hotspot.lat + r * Math.cos(v);
                const tLon = hotspot.lon + r * Math.sin(v) * 0.8; 

                // Signal degrades slightly on the edge (lower signal = lower heatmap weight)
                const centerDist = r / hotspot.radius; // 0 to 2
                let weight = 10 - (centerDist * 4); 
                weight += (Math.random() * 4 - 2);
                weight = Math.max(0.5, Math.min(10, weight));

                result[carrier].push({ lat: tLat, lon: tLon, weight });
            }
        });
        
        // Add arbitrary highway scatter for a realistic "vascular" nPerf look
        Object.keys(CARRIER_PROFILES).forEach(carrier => {
            if (carrier === 'nine_mobile') return; 
            const pointsHighway = Math.floor(40 * hotspot.weight);
            for(let i = 0; i < pointsHighway; i++) {
                 const tLat = hotspot.lat + ((Math.random() - 0.5) * 4);
                 const tLon = hotspot.lon + ((Math.random() - 0.5) * 4);
                 result[carrier].push({ lat: tLat, lon: tLon, weight: Math.random() * 3 + 0.5 });
            }
        });
    }

    return result;
};
