import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Facebook, Mail, Linkedin, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../services/supabaseClient';
import Logo from './Logo';

const Login = () => {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            alert(error.message);
            setLoading(false);
        } else {
            console.log("Logged in!", data.user);
            navigate('/dashboard');
        }
    };

    return (
        <div className="flex bg-[#ccfbf1] min-h-screen items-center justify-center p-4 py-6">
            <div className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden border border-white/20">

                {/* Left Side: Login Form */}
                <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col items-center justify-center relative">
                    <h2 className="text-3xl font-black text-gray-800 mb-1 tracking-tighter">Login to Your Account</h2>
                    <p className="text-gray-400 mb-5 text-sm font-medium">Login using social networks</p>

                    {/* Social Icons */}
                    <div className="flex gap-4 mb-5">
                        <button className="w-12 h-12 rounded-full bg-[#4267b2] flex items-center justify-center text-white shadow-md hover:scale-110 transition-transform">
                            <Facebook className="w-6 h-6 fill-current" />
                        </button>
                        <button className="w-12 h-12 rounded-full bg-[#db4437] flex items-center justify-center text-white shadow-md hover:scale-110 transition-transform">
                            <Mail className="w-6 h-6" />
                        </button>
                        <button className="w-12 h-12 rounded-full bg-[#0077b5] flex items-center justify-center text-white shadow-md hover:scale-110 transition-transform">
                            <Linkedin className="w-6 h-6 fill-current" />
                        </button>
                    </div>

                    <div className="flex items-center w-full max-w-sm mb-5">
                        <hr className="flex-1 border-gray-100" />
                        <span className="px-5 text-gray-300 text-sm font-bold uppercase tracking-widest">or</span>
                        <hr className="flex-1 border-gray-100" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSignIn} className="w-full max-w-sm flex flex-col gap-3">
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
                            className={`mt-3 w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl text-lg font-black tracking-tight transition-all shadow-xl shadow-emerald-500/20 active:scale-95 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'SIGNING IN...' : 'Sign In'}
                        </button>
                    </form>
                </div>

                {/* Right Side: Welcome Panel */}
                <div className="w-full md:w-2/5 p-6 md:p-10 flex flex-col items-center justify-center text-center relative overflow-hidden bg-gradient-to-br from-[#12a88e] to-[#047857] text-white">
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl transform -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-400/20 rounded-full blur-3xl transform translate-y-1/3 -translate-x-1/3" />
                    
                    <div className="relative z-10 flex flex-col items-center">
                        <h2 className="text-3xl font-black mb-4 tracking-tighter">New Here?</h2>
                        <p className="text-emerald-100/80 mb-6 max-w-[260px] text-base font-medium leading-relaxed">
                            Sign up and discover a great amount of new opportunities!
                        </p>
                        <button
                            onClick={() => navigate('/signup')}
                            className="w-48 py-4 bg-white text-emerald-600 hover:bg-emerald-50 rounded-2xl text-lg font-black tracking-tight transition-all shadow-2xl active:scale-95"
                        >
                            Sign Up
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Login;
