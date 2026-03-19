import React from 'react';
import { useSignalSim } from '../hooks/useSignalSim';
import SignalDial from './SignalDial';
import NetworkCard from './NetworkCard';

const TelemetryView = () => {
    const { networks, bestNetwork, bestDbm, connectionType } = useSignalSim();

    return (
        <main className="w-full max-w-[1000px] mx-auto p-4 sm:p-8 flex flex-col gap-8 relative z-10 animate-fade-in">
            <header className="text-center mb-4">
                <h1 className="text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-white to-teal-400 bg-clip-text text-transparent tracking-tight mb-2">
                    Signal Pulse
                </h1>
                <p className="text-white/60 text-lg">Real-time network telemetrics simulation</p>
            </header>

            <SignalDial bestDbm={bestDbm} bestNetwork={bestNetwork} connectionType={connectionType} />

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <NetworkCard
                    brand="MTN"
                    colorClass="mtn-yellow"
                    glowClass="rgba(255,204,0,0.4)"
                    data={networks.mtn}
                />
                <NetworkCard
                    brand="Airtel"
                    colorClass="airtel-red"
                    glowClass="rgba(255,0,0,0.4)"
                    data={networks.airtel}
                />
                <NetworkCard
                    brand="Glo"
                    colorClass="glo-green"
                    glowClass="rgba(0,153,51,0.4)"
                    data={networks.glo}
                />
            </section>
        </main>
    );
};

export default TelemetryView;
