import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import Logo from './Logo';

// Use the deployed app URL so email confirmation doesn't redirect to localhost
const APP_URL = 'https://glitch8x.github.io/signal-pluse';

const Signup = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${APP_URL}/login`,
            },
        });

        if (error) {
            alert(error.message);
            setLoading(false);
        } else {
            setConfirmed(true);
            setLoading(false);
        }
    };

    // Show branded confirmation screen after signup
    if (confirmed) {
        return (
            <div className="flex bg-[#ccfbf1] min-h-screen items-center justify-center p-4">
                <div className="flex flex-col items-center text-center bg-white rounded-[40px] shadow-2xl p-12 max-w-md w-full border border-white/20 gap-6">
                    <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-emerald-500" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-gray-800 tracking-tighter mb-2">Check your inbox!</h2>
                        <p className="text-gray-500 text-base leading-relaxed">
                            We sent a confirmation link to{' '}
                            <span className="font-bold text-emerald-600">{email}</span>.
                        </p>
                        <p className="text-gray-500 text-base mt-2">
                            Click it to activate your{' '}
                            <span className="font-black text-gray-800">Signal Pulse</span> account.
                        </p>
                    </div>
                    <div className="px-6 py-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-700 text-sm font-semibold">
                        📡 Signal Pulse — Confirm Your Signup
                    </div>
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-lg font-black tracking-tight transition-all shadow-xl shadow-emerald-500/20 active:scale-95"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex bg-[#ccfbf1] min-h-screen items-center justify-center p-4">
            <div className="flex flex-col md:flex-row w-full max-w-5xl bg-white rounded-[40px] shadow-2xl overflow-hidden min-h-[600px] border border-white/20">
                
                {/* Left Side: Welcome Panel (Teal Gradient) */}
                <div className="w-full md:w-2/5 p-8 md:p-16 flex flex-col items-center justify-center text-center relative overflow-hidden bg-gradient-to-br from-[#12a88e] to-[#047857] text-white order-2 md:order-1">
                    {/* Background decorations */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform -translate-y-1/2 -translate-x-1/2" />
                    <div className="absolute bottom-0 right-0 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl transform translate-y-1/3 translate-x-1/3" />
                    
                    <div className="relative z-10 flex flex-col items-center text-center">
                        <h2 className="text-4xl font-black mb-6 tracking-tighter">Welcome Back!</h2>
                        <p className="text-emerald-100/80 mb-10 max-w-[280px] text-lg font-medium leading-relaxed">
                            Already have an account? Sign in to view your telemetry dashboard.
                        </p>
                        <button
                            onClick={() => navigate('/login')}
                            className="w-48 py-4 bg-white text-emerald-600 hover:bg-emerald-50 rounded-2xl text-lg font-black tracking-tight transition-all shadow-2xl active:scale-95"
                        >
                            Sign In
                        </button>
                    </div>
                </div>

                {/* Right Side: Signup Form */}
                <div className="w-full md:w-3/5 p-8 md:p-16 flex flex-col items-center justify-center relative order-1 md:order-2">
                    <h2 className="text-4xl font-black text-gray-800 mb-2 mt-8 md:mt-0 tracking-tighter text-center">Create an Account</h2>
                    <p className="text-gray-400 mb-10 text-sm font-medium">Join Signal Pulse today.</p>
                    
                    <form onSubmit={handleSignUp} className="w-full max-w-sm flex flex-col gap-5">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400">
                                <Mail className="w-5 h-5 opacity-40" />
                            </div>
                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-14 pr-6 py-4 bg-gray-50 border-none rounded-2xl text-base font-medium focus:ring-2 focus:ring-emerald-400 outline-none text-gray-700 transition-all"
                                required
                            />
                        </div>

                        <div className="relative">
                            <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400">
                                <Lock className="w-5 h-5 opacity-40" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-14 pr-14 py-4 bg-gray-50 border-none rounded-2xl text-base font-medium focus:ring-2 focus:ring-emerald-400 outline-none text-gray-700 transition-all"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`mt-6 w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-lg font-black tracking-tight transition-all shadow-xl shadow-emerald-500/20 active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'SIGNING UP...' : 'Sign Up'}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
};

export default Signup;