import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { User, LogOut, Mail, ShieldCheck } from 'lucide-react';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser(session.user);
            } else {
                navigate('/login');
            }
            setLoading(false);
        };
        fetchUser();
    }, [navigate]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };

    if (loading) {
        return <div className="min-h-[500px] flex items-center justify-center text-teal-600 font-bold">Loading profile...</div>;
    }

    if (!user) return null;

    return (
        <div className="max-w-2xl mx-auto mt-16 p-6 animate-fade-in">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gradient-to-r from-teal-500 to-emerald-500 p-8 text-center text-white relative">
                    <div className="w-24 h-24 bg-white/20 rounded-full mx-auto flex items-center justify-center backdrop-blur-sm border-4 border-white/30 mb-4 shadow-lg">
                        <User className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-black tracking-tight">User Profile</h2>
                    <p className="text-teal-50 mt-1 font-medium text-sm tracking-wide">Secure Data Page</p>
                </div>
                
                <div className="p-8">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <div className="p-3 bg-white rounded-full shadow-sm">
                                <Mail className="w-5 h-5 text-teal-600" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</p>
                                <p className="text-gray-800 font-medium">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                            <div className="p-3 bg-white rounded-full shadow-sm">
                                <ShieldCheck className="w-5 h-5 text-teal-600" />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Account ID</p>
                                <p className="text-gray-800 font-mono text-xs truncate" title={user.id}>{user.id}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleSignOut}
                        className="w-full mt-10 py-4 rounded-2xl border-2 border-red-100 text-red-500 font-extrabold hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-5 h-5" />
                        SECURE SIGN OUT
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
