import React from 'react';
import { motion } from 'framer-motion';
import { useSignalSim } from '../hooks/useSignalSim';
import NetworkCard from './NetworkCard';
import MapSection from './MapSection';
import MySignalBanner from './MySignalBanner';
import TelephonyPanel from './TelephonyPanel';

const Dashboard = () => {
    const { networks, connectionType, towerCounts, telephony, location, retryLocation } = useSignalSim();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen pb-20 pt-10"
        >
            <main className="max-w-[1200px] mx-auto px-6 flex flex-col gap-10 relative z-10">

                {/* My Signal Checker */}
                <MySignalBanner networks={networks} />

                {/* API Status Panel — Location + Telephony + Celld */}
                <TelephonyPanel
                    telephony={telephony}
                    location={location}
                    towerCounts={towerCounts}
                    onRetryLocation={retryLocation}
                />

                {/* All Networks Status */}
                <section>
                    <div className="flex items-center gap-4 mb-6">
                        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Nigerian Network Status</h2>
                        <div className="h-px flex-grow bg-gradient-to-r from-emerald-400/30 to-transparent" />
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
                            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${connectionType.includes('Real') ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                            {connectionType}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <NetworkCard brand="MTN"     carrierId="mtn"         data={networks.mtn}         towerCount={towerCounts?.mtn} />
                        <NetworkCard brand="Airtel"  carrierId="airtel"      data={networks.airtel}      towerCount={towerCounts?.airtel} />
                        <NetworkCard brand="Glo"     carrierId="glo"         data={networks.glo}         towerCount={towerCounts?.glo} />
                        <NetworkCard brand="9mobile" carrierId="nine_mobile" data={networks.nine_mobile} towerCount={towerCounts?.nine_mobile} />
                    </div>
                </section>

                {/* Map Section */}
                <MapSection />

            </main>
        </motion.div>
    );
};

export default Dashboard;
