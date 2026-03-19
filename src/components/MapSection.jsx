import React from 'react';
import { NavLink } from 'react-router-dom';
import { MapPin, ArrowUpRight } from 'lucide-react';

const MapSection = () => {
    return (
        <NavLink to="/dashboard/maps" className="block group">
            <section className="bg-white border border-gray-200 rounded-[28px] p-8 relative overflow-hidden min-h-[450px] flex flex-col group-hover:border-emerald-300 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(16,185,129,0.12)] shadow-sm">
                <div className="flex justify-between items-start mb-8 relative z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Regional Focus</span>
                        </div>
                        <h3 className="text-3xl font-black text-gray-800 tracking-tighter">Minna Coverage</h3>
                        <p className="text-gray-400 text-sm mt-1 font-medium italic">Click to explore interactive network lines & signal density</p>
                    </div>
                    <div className="flex gap-3">
                        <div className="p-3 rounded-2xl bg-gray-100 border border-gray-200 text-gray-400 group-hover:text-emerald-600 group-hover:bg-emerald-50 transition-all duration-300">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                    </div>
                </div>

                {/* Map Preview */}
                <div className="flex-grow rounded-3xl bg-gray-50 border border-gray-200 relative overflow-hidden flex items-center justify-center group-hover:bg-emerald-50/30 transition-colors duration-500">
                    {/* Abstract Lines */}
                    <div className="absolute inset-0">
                        <svg className="w-full h-full opacity-10" viewBox="0 0 100 100">
                            <path d="M 0 50 Q 25 25 50 50 T 100 50" stroke="#10b981" strokeWidth="0.5" fill="none" />
                            <path d="M 0 30 Q 30 60 70 30 T 100 60" stroke="#10b981" strokeWidth="0.5" fill="none" opacity="0.5" />
                        </svg>
                    </div>

                    <div className="relative z-10 flex flex-col items-center text-center px-12 py-8">
                        <div className="w-24 h-24 mb-6 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-emerald-200 transition-all duration-700">
                            <MapPin className="w-10 h-10 text-emerald-600 animate-bounce" />
                        </div>
                        <p className="text-gray-800 font-black text-xl tracking-tight mb-2">Minna City Center</p>
                        <p className="text-gray-400 font-bold uppercase tracking-[0.25em] text-[10px]">9.5833° N, 6.5500° E</p>
                    </div>

                    {/* Pulse Effects */}
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>
                </div>

                <div className="mt-8 flex items-center justify-between text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                    <span>Niger State, Nigeria</span>
                    <span className="flex items-center gap-1 group-hover:text-emerald-600 transition-colors">
                        View Interactive Map <ArrowUpRight className="w-3 h-3" />
                    </span>
                </div>
            </section>
        </NavLink>
    );
};

export default MapSection;
